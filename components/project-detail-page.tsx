"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import {
  Save,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast" // Declare the useToast variable

// Mock data
const getMockProjectData = (id: string) => ({
  id,
  projectName: "新横浜工場 超純水製造設備新設工事における配管システム全面更新プロジェクト",
  projectNumber: "J81-000123",
  constructionNumber: "K-2024-101",
  pNumber: "P-8100-247",
  pNumberReason: "",
  orderClientName: "東洋製造株式会社",
  deliveryClientName: "東洋製造株式会社",
  deliveryOffice: "新横浜工場",
  orderAmount: 8500,
  cost: 5200,
  expectedProfit: 3300,
  expectedProfitRate: 38.8,
  orderYear: "2026",
  salesYear: "2027",
  expectedOrderDate: "2026-02-15",
  expectedDeliveryDate: "2027-03-01",
  orderDate: "2026-02-15",
  deliveryDate: "2027-03-01",
  completionDate: "",
  department: "ELB",
  techEvaluation: "A",
  controlCompany: "自社",
  constructionCompany: "協力会社A",
  orderProbability: "80%",
  priority: "高",
  managementStatus: "進行中",
  reportFlag: "1",
  invoiceFlag: "0",
  inputPerson: "田中 健一",
  projectUncertain: "0",
  remarks: "特記事項なし",
})

const getMockPlanData = () => ({
  systems: ["純水", "超純水", "前処理"],
  pipeVolume: 2500,
  constructionArea: 1200,
  pipeDensity: 2.08,
  floors: 3,
  otherEquipment: "有",
  constructionPeriod: 180,
  priorityLine: "A棟",
  difficulty: 1.32,
  difficultyPipe: 1.1,
  difficultyArea: 1.0,
  difficultyDensity: 1.1,
  difficultyFloors: 1.0,
  difficultyOther: 1.1,
  difficultyPeriod: 1.0,
  difficultyPriorityLine: 1.0,
  evaluatedArea: 1584,
  phases: {
    fs: { start: "2026-01-10", end: "2026-02-10" },
    basicInquiry: { start: "2026-02-11", end: "2026-03-15" },
    design: { start: "2026-03-16", end: "2026-05-31" },
    production: { start: "2026-06-01", end: "2026-09-30" },
    construction: { start: "2026-10-01", end: "2027-01-31" },
    testRun: { start: "2027-02-01", end: "2027-02-20" },
    actualProcessing: { start: "2027-02-21", end: "2027-03-01" },
  },
  keyDates: {
    deliverySpecConfirm: "2026-03-01",
    flowSheet: "2026-03-15",
    layoutWiring: "2026-04-01",
    buildingPowerRequest: "2026-04-15",
    foundationConstruction: "2026-05-01",
    pipingDrawing: "2026-05-15",
    buildingHandover: "2026-09-15",
    utilitySupply: "2026-12-01",
    waterStart: "2027-02-15",
  },
})

const getMockActualData = () => ({
  systems: ["純水", "超純水", "前処理", "回収"],
  pipeVolume: 2800,
  constructionArea: 1350,
  pipeDensity: 2.07,
  floors: 3,
  otherEquipment: "有",
  constructionPeriod: 195,
  priorityLine: "A棟",
  difficulty: 1.45,
  difficultyPipe: 1.1,
  difficultyArea: 1.1,
  difficultyDensity: 1.1,
  difficultyFloors: 1.0,
  difficultyOther: 1.1,
  difficultyPeriod: 1.1,
  difficultyPriorityLine: 1.0,
  evaluatedArea: 1958,
  phases: {
    fs: { start: "2026-01-10", end: "2026-02-15" },
    basicInquiry: { start: "2026-02-16", end: "2026-03-20" },
    design: { start: "2026-03-21", end: "2026-06-10" },
    production: { start: "2026-06-11", end: "2026-10-15" },
    construction: { start: "2026-10-16", end: "2027-02-10" },
    testRun: { start: "2027-02-11", end: "2027-02-28" },
    actualProcessing: { start: "2027-03-01", end: "2027-03-08" },
  },
  keyDates: {
    deliverySpecConfirm: "2026-03-05",
    flowSheet: "2026-03-25",
    layoutWiring: "2026-04-10",
    buildingPowerRequest: "2026-04-20",
    foundationConstruction: "2026-05-10",
    pipingDrawing: "2026-05-25",
    buildingHandover: "2026-10-01",
    utilitySupply: "2026-12-15",
    waterStart: "2027-02-25",
  },
})

const systemOptions = ["前処理", "純水", "超純水", "回収", "廃水", "POU"]

const phaseLabels: Record<string, string> = {
  fs: "FS",
  basicInquiry: "基本引合",
  design: "設計",
  production: "製作/発注",
  construction: "工事",
  testRun: "試運転",
  actualProcessing: "実設処理",
}

const keyDateLabels: Record<string, string> = {
  deliverySpecConfirm: "納入仕様確定",
  flowSheet: "フローシート",
  layoutWiring: "配置・配線図",
  buildingPowerRequest: "建築電源申入",
  foundationConstruction: "基礎工事・決済",
  pipingDrawing: "配管施工図",
  buildingHandover: "建築・土木引渡",
  utilitySupply: "ユーティリティ供給",
  waterStart: "水出し",
}

interface ProjectDetailPageProps {
  projectId: string
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [mode, setMode] = useState<"plan" | "actual">("plan")
  const [showComparison, setShowComparison] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const projectData = getMockProjectData(projectId)
  const [planData, setPlanData] = useState(getMockPlanData())
  const [actualData, setActualData] = useState(getMockActualData())
  const [plannerInput, setPlannerInput] = useState({
    inputPerson: projectData.inputPerson,
    projectUncertain: projectData.projectUncertain,
    remarks: projectData.remarks,
  })

  const currentData = mode === "plan" ? planData : actualData
  const comparisonData = mode === "plan" ? actualData : planData

  const systemRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<HTMLDivElement>(null)
  const keyDateRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSave = () => {
    toast({
      title: "保存しました（ダミー）",
      description: "案件情報が正常に保存されました。",
    })
  }

  const handleCancel = () => {
    router.push("/projects")
  }

  const handleSystemChange = (system: string, checked: boolean) => {
    const setData = mode === "plan" ? setPlanData : setActualData
    setData((prev) => ({
      ...prev,
      systems: checked ? [...prev.systems, system] : prev.systems.filter((s) => s !== system),
    }))
  }

  const handleInputChange = (field: string, value: string | number) => {
    const setData = mode === "plan" ? setPlanData : setActualData
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhaseChange = (phase: string, type: "start" | "end", value: string) => {
    const setData = mode === "plan" ? setPlanData : setActualData
    setData((prev) => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phase]: { ...prev.phases[phase as keyof typeof prev.phases], [type]: value },
      },
    }))
  }

  const handleKeyDateChange = (key: string, value: string) => {
    const setData = mode === "plan" ? setPlanData : setActualData
    setData((prev) => ({
      ...prev,
      keyDates: { ...prev.keyDates, [key]: value },
    }))
  }

  // Calculate important key dates (approaching or overdue)
  const getImportantKeyDates = () => {
    const today = new Date()
    const dates = Object.entries(currentData.keyDates).map(([key, date]) => {
      const dateObj = new Date(date)
      const diffDays = Math.ceil((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { key, date, diffDays, label: keyDateLabels[key] }
    })
    return dates
      .filter((d) => d.diffDays <= 30)
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 3)
  }

  const importantKeyDates = getImportantKeyDates()

  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar activeItem="projects" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-border px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">{projectData.projectName}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>案件番号: {projectData.projectNumber}</span>
                <span>P番: {projectData.pNumber || "未発行"}</span>
                <span>工事番号: {projectData.constructionNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {/* Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setMode("plan")}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                    mode === "plan" ? "bg-[#2196F3] text-white" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  計画
                </button>
                <button
                  onClick={() => setMode("actual")}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                    mode === "actual" ? "bg-[#4CAF50] text-white" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  実績
                </button>
              </div>

              {/* Comparison Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">比較表示</span>
                <Switch checked={showComparison} onCheckedChange={setShowComparison} />
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                SN
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex items-center gap-2">
                <Button onClick={handleSave} className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Column - Reference Info */}
          <div className="w-80 shrink-0 overflow-y-auto p-4 border-r border-border bg-white">
            {/* Basic Info */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("basic")}
                className="flex items-center gap-2 w-full text-left font-medium text-sm mb-2"
              >
                {collapsedSections.basic ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                案件基本情報
              </button>
              {!collapsedSections.basic && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">案件番号</span>
                    <span>{projectData.projectNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">工事番号</span>
                    <span>{projectData.constructionNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P番</span>
                    <span>{projectData.pNumber || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P番未発行理由</span>
                    <span>{projectData.pNumberReason || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注先名</span>
                    <span>{projectData.orderClientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">納入先事業所名</span>
                    <span>{projectData.deliveryClientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">納入先事業所</span>
                    <span>{projectData.deliveryOffice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Amount & Dates */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("amount")}
                className="flex items-center gap-2 w-full text-left font-medium text-sm mb-2"
              >
                {collapsedSections.amount ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                金額・日付
              </button>
              {!collapsedSections.amount && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注額(M¥)</span>
                    <span>{projectData.orderAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">原価(M¥)</span>
                    <span>{projectData.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">予想粗利(M¥)</span>
                    <span>{projectData.expectedProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">予想粗利率(%)</span>
                    <span>{projectData.expectedProfitRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注年度</span>
                    <span>{projectData.orderYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">売上年度</span>
                    <span>{projectData.salesYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注予定日</span>
                    <span>{projectData.expectedOrderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">納入予定日</span>
                    <span>{projectData.expectedDeliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注日</span>
                    <span>{projectData.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">納入日</span>
                    <span>{projectData.deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">完了日</span>
                    <span>{projectData.completionDate || "-"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Operation & Evaluation */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("operation")}
                className="flex items-center gap-2 w-full text-left font-medium text-sm mb-2"
              >
                {collapsedSections.operation ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                運用・評価
              </button>
              {!collapsedSections.operation && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">案件対応部門</span>
                    <span>{projectData.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">技術部門会社の評価</span>
                    <span>{projectData.techEvaluation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">制御担当会社</span>
                    <span>{projectData.controlCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">工事担当会社</span>
                    <span>{projectData.constructionCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">受注確度</span>
                    <span>{projectData.orderProbability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">優先順位</span>
                    <span>{projectData.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">案件管理状況</span>
                    <span>{projectData.managementStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">報告フラグ</span>
                    <span>{projectData.reportFlag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">請求フラグ</span>
                    <span>{projectData.invoiceFlag}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Input Info */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Health Status */}
            <div className="bg-white rounded-lg border border-border p-4 mb-4">
              <h3 className="font-medium text-sm mb-3">
                {mode === "plan" ? "ヘルス状態（計画）" : "ヘルス状態（実績）"}
              </h3>

              {mode === "plan" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">難易度:</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        currentData.difficulty >= 1.4
                          ? "bg-red-100 text-red-700"
                          : currentData.difficulty >= 1.2
                            ? "bg-orange-100 text-orange-700"
                            : currentData.difficulty >= 1.1
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700",
                      )}
                    >
                      {currentData.difficulty >= 1.4
                        ? "非常に高"
                        : currentData.difficulty >= 1.2
                          ? "高"
                          : currentData.difficulty >= 1.1
                            ? "中"
                            : "低"}{" "}
                      (×{currentData.difficulty.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded">キーデート過密</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded">影響度高</span>
                    {!projectData.pNumber && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded">P番未発行</span>
                    )}
                    {currentData.constructionPeriod > 180 && (
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">工事期間長</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">推奨アクション:</span> 上長レビュー, スキル時間不足の対処方針記入
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button onClick={() => scrollToSection(systemRef)} className="text-[#2196F3] hover:underline">
                      → システム内容を確認
                    </button>
                    <button onClick={() => scrollToSection(phaseRef)} className="text-[#2196F3] hover:underline">
                      → フェーズを確認
                    </button>
                    <button onClick={() => scrollToSection(keyDateRef)} className="text-[#2196F3] hover:underline">
                      → キーデートを確認
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">トレンド:</span>
                    {actualData.difficulty > planData.difficulty ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        <TrendingUp className="w-3 h-3" /> 悪化
                      </span>
                    ) : actualData.difficulty < planData.difficulty ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        <TrendingDown className="w-3 h-3" /> 改善
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        <Minus className="w-3 h-3" /> 横ばい
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      <span>工事フェーズ遅延 +10日</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-red-500" />
                      <span>重要キーデート接近（水出し: 14日後）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span>
                        影響度上昇 (×{planData.difficulty.toFixed(2)} → ×{actualData.difficulty.toFixed(2)})
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">予防アクション:</span> 14日以内のキーデート対策、未更新解消
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">今すぐ: キーデート確認</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded">期限までに: 進捗更新</span>
                  </div>
                </div>
              )}
            </div>

            {/* Important Key Dates Card */}
            {importantKeyDates.length > 0 && (
              <div className="bg-white rounded-lg border border-orange-200 p-4 mb-4">
                <h3 className="font-medium text-sm mb-2 text-orange-700">重要キーデート</h3>
                <div className="space-y-2">
                  {importantKeyDates.map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-sm">
                      <span>{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span>{item.date}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs",
                            item.diffDays < 0
                              ? "bg-red-100 text-red-700"
                              : item.diffDays <= 7
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {item.diffDays < 0 ? `${Math.abs(item.diffDays)}日超過` : `${item.diffDays}日後`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planner Input */}
            <div className="bg-white rounded-lg border border-border p-4 mb-4">
              <h3 className="font-medium text-sm mb-3">計画者入力</h3>
              <div className="bg-red-50 border border-red-200 rounded p-2 mb-3 text-xs text-red-700">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                計画者の方は、これより下の箇所に入力してください（案件の詳細が未確定で情報を入力できない場合は、案件情報未確定を「1」としてください）
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">入力担当者</label>
                  <Input
                    value={plannerInput.inputPerson}
                    onChange={(e) => setPlannerInput((prev) => ({ ...prev, inputPerson: e.target.value }))}
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">案件情報未確定</label>
                  <Input
                    value={plannerInput.projectUncertain}
                    onChange={(e) => setPlannerInput((prev) => ({ ...prev, projectUncertain: e.target.value }))}
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">備考</label>
                  <Input
                    value={plannerInput.remarks}
                    onChange={(e) => setPlannerInput((prev) => ({ ...prev, remarks: e.target.value }))}
                    className="h-8 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              {/* System Content - Left */}
              <div ref={systemRef} className="w-1/2 bg-white rounded-lg border border-border p-4">
                <h3 className="font-medium text-sm mb-3">システム内容</h3>

                {/* System Selection */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">システム（複数選択可）</label>
                  <div className="flex flex-wrap gap-3">
                    {systemOptions.map((system) => (
                      <label key={system} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={currentData.systems.includes(system)}
                          onCheckedChange={(checked) => handleSystemChange(system, !!checked)}
                        />
                        {system}
                        {showComparison && (
                          <span
                            className={cn(
                              "text-xs",
                              comparisonData.systems.includes(system) ? "text-muted-foreground" : "text-red-400",
                            )}
                          >
                            {comparisonData.systems.includes(system) ? "" : "(差分)"}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* System Details Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">項目</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">値</th>
                        <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">難易度係数</th>
                        {showComparison && (
                          <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">
                            {mode === "plan" ? "実績" : "計画"}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-2">配管vol.(BM)</td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={currentData.pipeVolume}
                            onChange={(e) => handleInputChange("pipeVolume", Number(e.target.value))}
                            className="h-7 w-24 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyPipe > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyPipe.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">{comparisonData.pipeVolume}</td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">施工面積(m²)</td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={currentData.constructionArea}
                            onChange={(e) => handleInputChange("constructionArea", Number(e.target.value))}
                            className="h-7 w-24 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyArea > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyArea.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">{comparisonData.constructionArea}</td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">配管密度(BM/m²)</td>
                        <td className="py-2 px-2 text-muted-foreground">
                          {(currentData.pipeVolume / currentData.constructionArea).toFixed(2)}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyDensity > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyDensity.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">
                            {(comparisonData.pipeVolume / comparisonData.constructionArea).toFixed(2)}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">階層（階）</td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={currentData.floors}
                            onChange={(e) => handleInputChange("floors", Number(e.target.value))}
                            className="h-7 w-24 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyFloors > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyFloors.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && <td className="py-2 px-2 text-muted-foreground">{comparisonData.floors}</td>}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">他業者輻輳</td>
                        <td className="py-2 px-2">
                          <select
                            value={currentData.otherEquipment}
                            onChange={(e) => handleInputChange("otherEquipment", e.target.value)}
                            className="h-7 w-24 text-sm border rounded px-2"
                          >
                            <option value="無">無</option>
                            <option value="有">有</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyOther > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyOther.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">{comparisonData.otherEquipment}</td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">工事期間（日）</td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={currentData.constructionPeriod}
                            onChange={(e) => handleInputChange("constructionPeriod", Number(e.target.value))}
                            className="h-7 w-24 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyPeriod > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyPeriod.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">{comparisonData.constructionPeriod}</td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">優先施工ライン</td>
                        <td className="py-2 px-2">
                          <Input
                            value={currentData.priorityLine}
                            onChange={(e) => handleInputChange("priorityLine", e.target.value)}
                            className="h-7 w-24 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              currentData.difficultyPriorityLine > 1 ? "bg-red-100 text-red-700" : "bg-gray-100",
                            )}
                          >
                            ×{currentData.difficultyPriorityLine.toFixed(1)}
                          </span>
                        </td>
                        {showComparison && (
                          <td className="py-2 px-2 text-muted-foreground">{comparisonData.priorityLine}</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t flex items-center gap-6">
                  <div>
                    <span className="text-xs text-muted-foreground">総合難易度:</span>
                    <span
                      className={cn(
                        "ml-2 px-2 py-0.5 rounded text-sm font-medium",
                        currentData.difficulty >= 1.4
                          ? "bg-red-100 text-red-700"
                          : currentData.difficulty >= 1.2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700",
                      )}
                    >
                      ×{currentData.difficulty.toFixed(2)}
                    </span>
                    {showComparison && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({mode === "plan" ? "実績" : "計画"}: ×{comparisonData.difficulty.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">評価施工面積(m²):</span>
                    <span className="ml-2 font-medium">{currentData.evaluatedArea.toLocaleString()}</span>
                    {showComparison && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({mode === "plan" ? "実績" : "計画"}: {comparisonData.evaluatedArea.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Phases - Right */}
              <div ref={phaseRef} className="bg-white rounded border border-border p-3 w-1/2">
                <h4 className="font-medium text-sm mb-2">フェーズ</h4>
                <div className="space-y-1">
                  {Object.entries(phaseLabels).map(([key, label]) => {
                    const phase = currentData.phases[key as keyof typeof currentData.phases]
                    const compPhase = comparisonData.phases[key as keyof typeof comparisonData.phases]
                    const startError = phase.start && phase.end && phase.start > phase.end
                    return (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="w-20 text-muted-foreground shrink-0">{label}</span>
                        <div className="flex items-center gap-1">
                          <Input
                            type="date"
                            value={phase.start || ""}
                            onChange={(e) => handlePhaseChange(key, "start", e.target.value)}
                            className={cn("h-6 text-xs w-[130px]", startError && "border-red-500")}
                          />
                          <span className="text-muted-foreground">〜</span>
                          <Input
                            type="date"
                            value={phase.end || ""}
                            onChange={(e) => handlePhaseChange(key, "end", e.target.value)}
                            className={cn("h-6 text-xs w-[130px]", startError && "border-red-500")}
                          />
                        </div>
                        {showComparison && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({mode === "plan" ? "実" : "計"}: {compPhase.start || "-"} 〜 {compPhase.end || "-"})
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div ref={keyDateRef} className="bg-white rounded-lg border border-border p-4">
              <h3 className="font-medium text-sm mb-3">キーデート</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(keyDateLabels).map(([key, label]) => {
                  const value = currentData.keyDates[key as keyof typeof currentData.keyDates]
                  const compValue = comparisonData.keyDates[key as keyof typeof comparisonData.keyDates]
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="w-28 text-muted-foreground shrink-0 whitespace-nowrap">{label}</span>
                      <Input
                        type="date"
                        value={value || ""}
                        onChange={(e) => handleKeyDateChange(key, e.target.value)}
                        className="h-6 text-xs w-[130px]"
                      />
                      {showComparison && (
                        <span className="text-xs text-muted-foreground">
                          ({mode === "plan" ? "実" : "計"}: {compValue || "-"})
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
