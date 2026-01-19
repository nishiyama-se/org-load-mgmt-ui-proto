"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Database,
  Users,
  Clock,
  Search,
  X,
  FileSpreadsheet,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// モックデータ
const healthSummary = {
  normal: 2,
  warning: 1,
  error: 1,
  lastCheck: "2026-01-16 09:30",
  recentIssues: [
    { source: "Kaonavi", message: "スキルスコア取込で例外3件" },
    { source: "Excel生成", message: "PPB 2026-01 生成失敗" },
  ],
}

const dataSources = {
  kintone: {
    name: "Kintone",
    description: "案件基本情報の同期",
    status: "warning" as const,
    lastSuccess: "2026-01-16 08:00",
    lastRun: "2026-01-16 09:00",
    lastRunResult: "success" as const,
    targetPeriod: "随時（差分同期）",
    syncMethod: "差分",
    counts: {
      updated: 45,
      created: 3,
      excluded: 12,
    },
    excludedReasons: [
      { reason: "P番なし", count: 8 },
      { reason: "1by1違反", count: 2 },
      { reason: "担当不整合", count: 2 },
    ],
    lastSyncRange: "更新日時 >= 2026-01-15 00:00",
    error: null,
  },
  kaonavi: {
    name: "Kaonavi",
    description: "スキルスコア",
    status: "error" as const,
    lastSuccess: "2026-01-15 06:00",
    lastRun: "2026-01-16 06:00",
    lastRunResult: "failed" as const,
    targetPeriod: "2025-11",
    conversionStatus: "一部例外あり",
    counts: {
      success: 142,
      exception: 3,
    },
    exceptionReasons: [
      { reason: "必須項目欠落", count: 2 },
      { reason: "社員ID不一致", count: 1 },
    ],
    error: "スキルポイント変換で例外発生（3件）",
  },
  mh: {
    name: "MH",
    description: "労働時間/工数データ",
    status: "normal" as const,
    lastSuccess: "2026-01-10 07:00",
    lastRun: "2026-01-10 07:00",
    lastRunResult: "success" as const,
    targetPeriod: "2026-01",
    targetMonth: "2026-01",
    counts: {
      records: 1250,
    },
    delayStatus: "正常",
    delayDays: 0,
    processSteps: [
      { name: "検知", status: "completed" as const },
      { name: "アップロード", status: "completed" as const },
      { name: "取込", status: "completed" as const },
      { name: "完了", status: "completed" as const },
    ],
    error: null,
  },
}

const excelGenerationStatus = [
  {
    bu: "ELB",
    buName: "電気設備ビジネスユニット",
    period: "2026-01",
    generated: true,
    lastGenerated: "2026-01-16 06:00",
  },
  { bu: "PPB", buName: "プラントビジネスユニット", period: "2026-01", generated: false, lastGenerated: "-" },
  {
    bu: "ELA",
    buName: "エネルギーソリューションユニット",
    period: "2026-01",
    generated: true,
    lastGenerated: "2026-01-16 06:00",
  },
  { bu: "ELC", buName: "環境システムユニット", period: "2026-01", generated: true, lastGenerated: "2026-01-16 06:00" },
]

const jobHistory = [
  {
    id: 1,
    time: "2026-01-16 09:00",
    source: "Kintone",
    job: "差分同期",
    period: "-",
    result: "success",
    count: 48,
    duration: "12秒",
    message: "正常終了",
  },
  {
    id: 2,
    time: "2026-01-16 06:00",
    source: "Kaonavi",
    job: "スキルスコア取込",
    period: "2025-11",
    result: "failed",
    count: 145,
    duration: "45秒",
    message: "例外3件: 必須項目欠落2件、社員ID不一致1件",
  },
  {
    id: 3,
    time: "2026-01-16 06:00",
    source: "Excel生成",
    job: "月次Excel生成",
    period: "2026-01",
    result: "success",
    count: 3,
    duration: "2分15秒",
    message: "ELB, ELA, ELC 生成完了",
  },
  {
    id: 4,
    time: "2026-01-15 21:00",
    source: "Kintone",
    job: "差分同期",
    period: "-",
    result: "success",
    count: 12,
    duration: "8秒",
    message: "正常終了",
  },
  {
    id: 5,
    time: "2026-01-15 06:00",
    source: "Excel生成",
    job: "月次Excel生成",
    period: "2026-01",
    result: "failed",
    count: 1,
    duration: "45秒",
    message: "PPB: データ取得エラー",
  },
  {
    id: 6,
    time: "2026-01-15 06:00",
    source: "Kaonavi",
    job: "スキルスコア取込",
    period: "2025-11",
    result: "success",
    count: 142,
    duration: "42秒",
    message: "正常終了",
  },
  {
    id: 7,
    time: "2026-01-14 21:00",
    source: "Kintone",
    job: "差分同期",
    period: "-",
    result: "success",
    count: 23,
    duration: "10秒",
    message: "正常終了",
  },
  {
    id: 8,
    time: "2026-01-10 07:00",
    source: "MH",
    job: "月次工数取込",
    period: "2026-01",
    result: "success",
    count: 1250,
    duration: "2分30秒",
    message: "正常終了",
  },
]

type StatusType = "normal" | "warning" | "error"

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string; icon: typeof CheckCircle }> = {
  normal: { label: "正常", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle },
  warning: { label: "注意", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertTriangle },
  error: { label: "異常", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle },
}

export function SystemInfoContent() {
  const { toast } = useToast()
  const [sourceFilter, setSourceFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<(typeof jobHistory)[0] | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    kintone: true,
    kaonavi: true,
    mh: true,
    excel: true,
  })

  const handleRefresh = () => {
    toast({ title: "最新に更新しました（ダミー）" })
  }

  const handleRegenerateAllExcel = () => {
    toast({ title: "全BUのExcel再生成を開始しました（ダミー）" })
  }

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredHistory = jobHistory.filter((job) => {
    if (sourceFilter !== "all" && job.source !== sourceFilter) return false
    if (resultFilter !== "all" && job.result !== resultFilter) return false
    if (
      searchQuery &&
      !job.job.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const StatusBadge = ({ status }: { status: StatusType }) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
          config.bgColor,
          config.color,
        )}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const ResultBadge = ({ result }: { result: "success" | "failed" }) => (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        result === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
      )}
    >
      {result === "success" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {result === "success" ? "成功" : "失敗"}
    </span>
  )

  const ProcessStepBadge = ({ step }: { step: { name: string; status: "completed" | "pending" | "failed" } }) => (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs",
        step.status === "completed"
          ? "bg-green-100 text-green-600"
          : step.status === "failed"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-500",
      )}
    >
      {step.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
      {step.name}
    </span>
  )

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">システム情報</h1>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
          SN
        </div>
      </div>

      <div className="flex items-center justify-end mb-4">
        <Button variant="outline" size="sm" className="h-8 bg-transparent" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" />
          最新に更新
        </Button>
      </div>

      {/* Health Summary */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h2 className="text-base font-semibold mb-3">全体ヘルス</h2>
        <div className="flex items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm">正常:</span>
            <span className="text-lg font-bold text-green-600">{healthSummary.normal}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">注意:</span>
            <span className="text-lg font-bold text-yellow-600">{healthSummary.warning}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm">異常:</span>
            <span className="text-lg font-bold text-red-600">{healthSummary.error}</span>
          </div>
          <div className="text-sm text-muted-foreground ml-auto">最終チェック: {healthSummary.lastCheck}</div>
        </div>
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2">直近の問題:</p>
          <div className="flex flex-wrap gap-2">
            {healthSummary.recentIssues.map((issue, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                <AlertTriangle className="w-3 h-3" />
                {issue.source}: {issue.message}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Cards - 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Kintone Card */}
        <div className="bg-white rounded-lg border">
          <div
            className="flex items-center justify-between p-3 cursor-pointer border-b"
            onClick={() => toggleCard("kintone")}
          >
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-semibold text-sm">{dataSources.kintone.name}</h3>
                <p className="text-xs text-muted-foreground">{dataSources.kintone.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={dataSources.kintone.status} />
              {expandedCards.kintone ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expandedCards.kintone && (
            <div className="p-3 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">最終成功:</span>
                  <span className="ml-1">{dataSources.kintone.lastSuccess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">同期方式:</span>
                  <span className="ml-1">{dataSources.kintone.syncMethod}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">対象期間:</span>
                  <span className="ml-1">{dataSources.kintone.targetPeriod}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">範囲:</span>
                  <span className="ml-1 text-xs">{dataSources.kintone.lastSyncRange}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">処理件数:</p>
                <div className="flex gap-3 text-xs">
                  <span>
                    更新: <strong>{dataSources.kintone.counts.updated}</strong>
                  </span>
                  <span>
                    新規: <strong>{dataSources.kintone.counts.created}</strong>
                  </span>
                  <span className="text-yellow-600">
                    除外: <strong>{dataSources.kintone.counts.excluded}</strong>
                  </span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">除外理由内訳:</p>
                <div className="space-y-1">
                  {dataSources.kintone.excludedReasons.map((r, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{r.reason}</span>
                      <span className="text-yellow-600">{r.count}件</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kaonavi Card */}
        <div className="bg-white rounded-lg border">
          <div
            className="flex items-center justify-between p-3 cursor-pointer border-b"
            onClick={() => toggleCard("kaonavi")}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="font-semibold text-sm">{dataSources.kaonavi.name}</h3>
                <p className="text-xs text-muted-foreground">{dataSources.kaonavi.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={dataSources.kaonavi.status} />
              {expandedCards.kaonavi ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expandedCards.kaonavi && (
            <div className="p-3 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">最終成功:</span>
                  <span className="ml-1">{dataSources.kaonavi.lastSuccess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">対象期間:</span>
                  <span className="ml-1">{dataSources.kaonavi.targetPeriod}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">変換状態:</span>
                  <span className="ml-1 text-yellow-600">{dataSources.kaonavi.conversionStatus}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">処理件数:</p>
                <div className="flex gap-3 text-xs">
                  <span>
                    成功: <strong>{dataSources.kaonavi.counts.success}</strong>
                  </span>
                  <span className="text-red-600">
                    例外: <strong>{dataSources.kaonavi.counts.exception}</strong>
                  </span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">例外理由:</p>
                <div className="space-y-1">
                  {dataSources.kaonavi.exceptionReasons.map((r, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{r.reason}</span>
                      <span className="text-red-600">{r.count}件</span>
                    </div>
                  ))}
                </div>
              </div>
              {dataSources.kaonavi.error && (
                <div className="border-t pt-2">
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    <XCircle className="w-3 h-3 inline mr-1" />
                    {dataSources.kaonavi.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MH Card */}
        <div className="bg-white rounded-lg border">
          <div
            className="flex items-center justify-between p-3 cursor-pointer border-b"
            onClick={() => toggleCard("mh")}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-semibold text-sm">{dataSources.mh.name}</h3>
                <p className="text-xs text-muted-foreground">{dataSources.mh.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={dataSources.mh.status} />
              {expandedCards.mh ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expandedCards.mh && (
            <div className="p-3 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">最終成功:</span>
                  <span className="ml-1">{dataSources.mh.lastSuccess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">対象月:</span>
                  <span className="ml-1">{dataSources.mh.targetMonth}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">遅延状態:</span>
                  <span className="ml-1">{dataSources.mh.delayStatus}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">処理件数:</p>
                <div className="flex gap-3 text-xs">
                  <span>
                    レコード: <strong>{dataSources.mh.counts.records}</strong>
                  </span>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">処理ステップ:</p>
                <div className="flex gap-2">
                  {dataSources.mh.processSteps.map((step, i) => (
                    <ProcessStepBadge key={i} step={step} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Excel Generation Card */}
        <div className="bg-white rounded-lg border">
          <div
            className="flex items-center justify-between p-3 cursor-pointer border-b"
            onClick={() => toggleCard("excel")}
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-sm">Excel事前生成</h3>
                <p className="text-xs text-muted-foreground">当月BU別Excelファイル</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={excelGenerationStatus.every((s) => s.generated) ? "normal" : "warning"} />
              {expandedCards.excel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expandedCards.excel && (
            <div className="p-3 text-sm space-y-2">
              <div className="border-b pb-2">
                <p className="text-xs text-muted-foreground mb-2">BU別生成状況:</p>
                <div className="space-y-1">
                  {excelGenerationStatus.map((status) => (
                    <div key={status.bu} className="flex items-center justify-between text-xs">
                      <span>
                        {status.bu} ({status.buName})
                      </span>
                      <div className="flex items-center gap-2">
                        {status.generated ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            生成済み
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            未生成
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-1">
                <Button size="sm" className="h-7 text-xs w-full" onClick={handleRegenerateAllExcel}>
                  <Play className="w-3 h-3 mr-1" />
                  全BU一括再生成
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job History */}
      <div className="bg-white rounded-lg border">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">取込ジョブ履歴</h2>
            <div className="flex items-center gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue placeholder="ソース" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ソース</SelectItem>
                  <SelectItem value="Kintone">Kintone</SelectItem>
                  <SelectItem value="Kaonavi">Kaonavi</SelectItem>
                  <SelectItem value="MH">MH</SelectItem>
                  <SelectItem value="Excel生成">Excel生成</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue placeholder="結果" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全結果</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="failed">失敗</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 h-7 pl-7 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className={cn("flex-1", selectedJob && "border-r")}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">日時</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ソース</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ジョブ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">対象期間</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">結果</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">件数</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">所要時間</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredHistory.map((job) => (
                  <tr
                    key={job.id}
                    className={cn("cursor-pointer hover:bg-gray-50", selectedJob?.id === job.id && "bg-blue-50")}
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="px-3 py-2 text-xs">{job.time}</td>
                    <td className="px-3 py-2 text-xs">{job.source}</td>
                    <td className="px-3 py-2 text-xs">{job.job}</td>
                    <td className="px-3 py-2 text-xs">{job.period}</td>
                    <td className="px-3 py-2">
                      <ResultBadge result={job.result as "success" | "failed"} />
                    </td>
                    <td className="px-3 py-2 text-xs">{job.count}</td>
                    <td className="px-3 py-2 text-xs">{job.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedJob && (
            <div className="w-80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">ジョブ詳細</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedJob(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">日時:</span>
                  <span>{selectedJob.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ソース:</span>
                  <span>{selectedJob.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ジョブ:</span>
                  <span>{selectedJob.job}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">対象期間:</span>
                  <span>{selectedJob.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">結果:</span>
                  <ResultBadge result={selectedJob.result as "success" | "failed"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">処理件数:</span>
                  <span>{selectedJob.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">所要時間:</span>
                  <span>{selectedJob.duration}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <span className="text-muted-foreground">メッセージ:</span>
                  <p className="mt-1 p-2 bg-gray-50 rounded text-xs">{selectedJob.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
