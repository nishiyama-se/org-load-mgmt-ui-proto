"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const systemOptions = ["前処理", "純水", "超純水", "回収", "廃水", "POU"] as const

interface ProjectEditContentProps {
  project: {
    projectNumber: string
    constructionNumber: string
    pNumber: string
    pNumberReason: string
    orderClientName: string
    deliveryClientName: string
    deliveryOffice: string
    projectName: string
    orderAmount: number
    cost: number
    expectedProfit: number
    expectedProfitRate: number
    orderYear: string
    salesYear: string
    expectedOrderDate: string
    expectedDeliveryDate: string
    orderDate: string
    deliveryDate: string
    completionDate: string
    department: string
    techEvaluation: string
    controlCompany: string
    constructionCompany: string
    orderProbability: string
    priority: string
    managementStatus: string
    reportFlag: string
    invoiceFlag: string
    inputPerson: string
    projectUncertain: string
    remarks: string
  }
}

interface SystemInputData {
  volume: number
  area: number
  floors: number
  congestion: string
  period: number
  priorityLine: string
}

interface PhaseData {
  phase: string
  start: string
  end: string
}

interface KeyDateData {
  item: string
  date: string
}

const initialPlanPhases: PhaseData[] = [
  { phase: "FS", start: "2026-01-15", end: "2026-02-28" },
  { phase: "基本引合", start: "2026-03-01", end: "2026-03-31" },
  { phase: "設計", start: "2026-04-01", end: "2026-06-30" },
  { phase: "製作/発注", start: "2026-07-01", end: "2026-09-30" },
  { phase: "工事", start: "2026-10-01", end: "2026-11-30" },
  { phase: "試運転", start: "2026-12-01", end: "2026-12-15" },
  { phase: "実設処理", start: "2026-12-16", end: "2027-01-01" },
]

const initialActualPhases: PhaseData[] = [
  { phase: "FS", start: "2026-01-20", end: "2026-03-05" },
  { phase: "基本引合", start: "2026-03-06", end: "2026-04-10" },
  { phase: "設計", start: "", end: "" },
  { phase: "製作/発注", start: "", end: "" },
  { phase: "工事", start: "", end: "" },
  { phase: "試運転", start: "", end: "" },
  { phase: "実設処理", start: "", end: "" },
]

const initialPlanKeyDates: KeyDateData[] = [
  { item: "納入仕様確定", date: "2026-04-15" },
  { item: "フローシート", date: "2026-05-01" },
  { item: "配置・配線図", date: "2026-05-15" },
  { item: "建築電源申入", date: "2026-06-01" },
  { item: "基礎工事・決済", date: "2026-07-01" },
  { item: "配管施工図", date: "2026-07-15" },
  { item: "建築・土木引渡", date: "2026-09-01" },
  { item: "ユーティリティ供給", date: "2026-10-01" },
  { item: "水出し", date: "2026-12-01" },
]

const initialActualKeyDates: KeyDateData[] = [
  { item: "納入仕様確定", date: "2026-04-20" },
  { item: "フローシート", date: "" },
  { item: "配置・配線図", date: "" },
  { item: "建築電源申入", date: "" },
  { item: "基礎工事・決済", date: "" },
  { item: "配管施工図", date: "" },
  { item: "建築・土木引渡", date: "" },
  { item: "ユーティリティ供給", date: "" },
  { item: "水出し", date: "" },
]

function calculateDifficultyCoefficient(value: number, type: string): number {
  if (value === 0) return 1.0
  if (type === "volume") return value > 200 ? 1.1 : 1.0
  if (type === "area") return value > 1000 ? 1.1 : 1.0
  if (type === "density") return value > 0.3 ? 1.1 : 1.0
  if (type === "floors") return value > 2 ? 1.1 : 1.0
  if (type === "congestion") return value === 1 ? 1.1 : 1.0
  if (type === "period") return value > 6 ? 1.1 : 1.0
  if (type === "priority") return value === 1 ? 1.1 : 1.0
  return 1.0
}

function CoefficientBadge({ value }: { value: number }) {
  const color = value > 1.0 ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-100"
  return <span className={`text-xs px-1 rounded ${color}`}>×{value.toFixed(1)}</span>
}

function CompactField({ label, value, width = "auto" }: { label: string; value: string | number; width?: string }) {
  return (
    <div className="flex flex-col" style={{ minWidth: width !== "auto" ? width : undefined }}>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-sm font-medium whitespace-nowrap">{value || "-"}</span>
    </div>
  )
}

export function ProjectEditContent({ project }: ProjectEditContentProps) {
  const [planSystems, setPlanSystems] = useState<string[]>(["前処理", "純水", "超純水"])
  const [planSystemData, setPlanSystemData] = useState<SystemInputData>({
    volume: 320,
    area: 1200,
    floors: 3,
    congestion: "有",
    period: 8,
    priorityLine: "有",
  })
  const [planPhases, setPlanPhases] = useState<PhaseData[]>(initialPlanPhases)
  const [planKeyDates, setPlanKeyDates] = useState<KeyDateData[]>(initialPlanKeyDates)

  const [actualSystems, setActualSystems] = useState<string[]>(["前処理", "純水"])
  const [actualSystemData, setActualSystemData] = useState<SystemInputData>({
    volume: 295,
    area: 1150,
    floors: 3,
    congestion: "有",
    period: 9,
    priorityLine: "有",
  })
  const [actualPhases, setActualPhases] = useState<PhaseData[]>(initialActualPhases)
  const [actualKeyDates, setActualKeyDates] = useState<KeyDateData[]>(initialActualKeyDates)

  const calculateValues = (data: SystemInputData) => {
    const density = data.area > 0 ? data.volume / data.area : 0
    const volumeCoef = calculateDifficultyCoefficient(data.volume, "volume")
    const areaCoef = calculateDifficultyCoefficient(data.area, "area")
    const densityCoef = calculateDifficultyCoefficient(density, "density")
    const floorsCoef = calculateDifficultyCoefficient(data.floors, "floors")
    const congestionCoef = calculateDifficultyCoefficient(data.congestion === "有" ? 1 : 0, "congestion")
    const periodCoef = calculateDifficultyCoefficient(data.period, "period")
    const priorityCoef = calculateDifficultyCoefficient(data.priorityLine === "有" ? 1 : 0, "priority")
    const overallCoef = volumeCoef * areaCoef * densityCoef * floorsCoef * congestionCoef * periodCoef * priorityCoef
    return {
      density: density.toFixed(3),
      volumeCoef,
      areaCoef,
      densityCoef,
      floorsCoef,
      congestionCoef,
      periodCoef,
      priorityCoef,
      overallCoef,
      evalArea: Math.round(data.area * overallCoef),
    }
  }

  const planCalc = useMemo(() => calculateValues(planSystemData), [planSystemData])
  const actualCalc = useMemo(() => calculateValues(actualSystemData), [actualSystemData])

  const toggleSystem = (systems: string[], setFn: (s: string[]) => void, system: string) => {
    setFn(systems.includes(system) ? systems.filter((s) => s !== system) : [...systems, system])
  }

  const renderTechPanel = (
    type: "plan" | "actual",
    systems: string[],
    setSystemsFn: (s: string[]) => void,
    systemData: SystemInputData,
    setDataFn: (d: SystemInputData) => void,
    phases: PhaseData[],
    setPhasesFn: (p: PhaseData[]) => void,
    keyDates: KeyDateData[],
    setKeyDatesFn: (k: KeyDateData[]) => void,
    calc: ReturnType<typeof calculateValues>,
  ) => {
    const isPlan = type === "plan"
    const bgClass = isPlan ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
    const titleClass = isPlan ? "text-blue-700" : "text-green-700"
    const title = isPlan ? "計画" : "実績"

    return (
      <div className={`${bgClass} rounded border p-2`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-base font-bold ${titleClass}`}>{title}</span>
          <div className="text-sm">
            難易度:{" "}
            <span className={`font-bold ${calc.overallCoef > 1 ? "text-red-600" : ""}`}>
              ×{calc.overallCoef.toFixed(2)}
            </span>
            <span className="ml-2">評価面積: {calc.evalArea}m²</span>
          </div>
        </div>

        {/* システム選択 */}
        <div className="flex flex-wrap gap-3 mb-1 p-1 bg-white rounded border">
          {systemOptions.map((s) => (
            <label key={s} className="flex items-center gap-1 cursor-pointer text-base">
              <Checkbox
                checked={systems.includes(s)}
                onCheckedChange={() => toggleSystem(systems, setSystemsFn, s)}
                className="h-4 w-4"
              />
              <span>{s}</span>
            </label>
          ))}
        </div>

        {/* システム内容 - 2行4列 */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-0.5 mb-1">
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">配管vol.</span>
            <Input
              type="number"
              value={systemData.volume}
              onChange={(e) => setDataFn({ ...systemData, volume: Number(e.target.value) })}
              className="h-7 text-base w-20"
            />
            <CoefficientBadge value={calc.volumeCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">施工面積</span>
            <Input
              type="number"
              value={systemData.area}
              onChange={(e) => setDataFn({ ...systemData, area: Number(e.target.value) })}
              className="h-7 text-base w-20"
            />
            <CoefficientBadge value={calc.areaCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">配管密度</span>
            <div className="h-7 px-2 bg-gray-100 rounded text-base flex items-center w-20">{calc.density}</div>
            <CoefficientBadge value={calc.densityCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">階層</span>
            <Input
              type="number"
              value={systemData.floors}
              onChange={(e) => setDataFn({ ...systemData, floors: Number(e.target.value) })}
              className="h-7 text-base w-20"
            />
            <CoefficientBadge value={calc.floorsCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">他業者</span>
            <Select value={systemData.congestion} onValueChange={(v) => setDataFn({ ...systemData, congestion: v })}>
              <SelectTrigger className="h-7 text-base w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="有">有</SelectItem>
                <SelectItem value="無">無</SelectItem>
              </SelectContent>
            </Select>
            <CoefficientBadge value={calc.congestionCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">工事期間</span>
            <Input
              type="number"
              value={systemData.period}
              onChange={(e) => setDataFn({ ...systemData, period: Number(e.target.value) })}
              className="h-7 text-base w-20"
            />
            <CoefficientBadge value={calc.periodCoef} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm w-16">優先施工</span>
            <Select
              value={systemData.priorityLine}
              onValueChange={(v) => setDataFn({ ...systemData, priorityLine: v })}
            >
              <SelectTrigger className="h-7 text-base w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="有">有</SelectItem>
                <SelectItem value="無">無</SelectItem>
              </SelectContent>
            </Select>
            <CoefficientBadge value={calc.priorityCoef} />
          </div>
        </div>

        {/* フェーズとキーデート横並び */}
        <div className="grid grid-cols-2 gap-2">
          {/* フェーズ */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-0.5">フェーズ</div>
            <div className="bg-white rounded border p-1 space-y-0.5">
              {phases.map((p, i) => (
                <div key={p.phase} className="flex items-center gap-1 text-sm">
                  <span className="w-14 text-xs">{p.phase}</span>
                  <Input
                    type="date"
                    value={p.start}
                    onChange={(e) => {
                      const n = [...phases]
                      n[i].start = e.target.value
                      setPhasesFn(n)
                    }}
                    className="h-6 text-xs w-[110px] px-1"
                  />
                  <span className="text-xs">〜</span>
                  <Input
                    type="date"
                    value={p.end}
                    onChange={(e) => {
                      const n = [...phases]
                      n[i].end = e.target.value
                      setPhasesFn(n)
                    }}
                    className="h-6 text-xs w-[110px] px-1"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* キーデート */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-0.5">キーデート</div>
            <div className="bg-white rounded border p-1 space-y-0.5">
              {keyDates.map((k, i) => (
                <div key={k.item} className="flex items-center gap-1 text-sm">
                  <span className="text-xs whitespace-nowrap w-28">{k.item}</span>
                  <Input
                    type="date"
                    value={k.date}
                    onChange={(e) => {
                      const n = [...keyDates]
                      n[i].date = e.target.value
                      setKeyDatesFn(n)
                    }}
                    className="h-6 text-xs w-[110px] px-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="bg-gray-50 rounded border p-2">
        <div className="text-sm font-medium text-gray-700 mb-1">案件情報</div>

        {/* 基本情報 */}
        <div className="mb-1">
          <div className="text-xs text-muted-foreground mb-0.5">基本情報</div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <CompactField label="案件番号" value={project.projectNumber} />
            <CompactField label="工事番号" value={project.constructionNumber} />
            <CompactField label="P番" value={project.pNumber} />
            <CompactField label="P番未発行理由" value={project.pNumberReason} />
            <CompactField label="受注先名" value={project.orderClientName} />
            <CompactField label="納入先事業所名" value={project.deliveryClientName} />
            <CompactField label="納入先事業所" value={project.deliveryOffice} />
            <CompactField label="案件名" value={project.projectName} />
          </div>
        </div>

        {/* 金額・年度・主要日付 */}
        <div className="mb-1">
          <div className="text-xs text-muted-foreground mb-0.5">金額・年度・主要日付</div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <CompactField label="受注額(M¥)" value={project.orderAmount.toLocaleString()} />
            <CompactField label="原価(M¥)" value={project.cost.toLocaleString()} />
            <CompactField label="予想粗利(M¥)" value={project.expectedProfit.toLocaleString()} />
            <CompactField label="粗利率(%)" value={`${project.expectedProfitRate}%`} />
            <CompactField label="受注年度" value={project.orderYear} />
            <CompactField label="売上年度" value={project.salesYear} />
            <CompactField label="受注予定日" value={project.expectedOrderDate} />
            <CompactField label="納入予定日" value={project.expectedDeliveryDate} />
            <CompactField label="受注日" value={project.orderDate} />
            <CompactField label="納入日" value={project.deliveryDate} />
            <CompactField label="完了日" value={project.completionDate} />
          </div>
        </div>

        {/* 受注難度／運用フラグ */}
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">受注難度／運用フラグ</div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <CompactField label="案件対応部門" value={project.department} />
            <CompactField label="技術部門会社評価" value={project.techEvaluation} />
            <CompactField label="制御担当会社" value={project.controlCompany} />
            <CompactField label="工事担当会社" value={project.constructionCompany} />
            <CompactField label="受注確度" value={project.orderProbability} />
            <CompactField label="優先順位" value={project.priority} />
            <CompactField label="案件管理状況" value={project.managementStatus} />
            <CompactField label="報告フラグ" value={project.reportFlag} />
            <CompactField label="請求フラグ" value={project.invoiceFlag} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded border p-1.5">
        <div className="flex items-center gap-4">
          <span className="text-xs text-blue-600 font-medium">計画者入力</span>
          <div className="flex items-center gap-1">
            <Label className="text-xs text-muted-foreground">担当者</Label>
            <Select defaultValue={project.inputPerson}>
              <SelectTrigger className="h-6 text-sm w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="田中 健一">田中 健一</SelectItem>
                <SelectItem value="鈴木 美咲">鈴木 美咲</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Label className="text-xs text-muted-foreground">未確定</Label>
            <Select defaultValue={project.projectUncertain}>
              <SelectTrigger className="h-6 text-sm w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">確定</SelectItem>
                <SelectItem value="1">未確定</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 flex-1">
            <Label className="text-xs text-muted-foreground">備考</Label>
            <Input defaultValue={project.remarks} className="h-6 text-sm" />
          </div>
        </div>
      </div>

      {/* 技術情報: 計画と実績 */}
      <div className="grid grid-cols-2 gap-2">
        {renderTechPanel(
          "plan",
          planSystems,
          setPlanSystems,
          planSystemData,
          setPlanSystemData,
          planPhases,
          setPlanPhases,
          planKeyDates,
          setPlanKeyDates,
          planCalc,
        )}
        {renderTechPanel(
          "actual",
          actualSystems,
          setActualSystems,
          actualSystemData,
          setActualSystemData,
          actualPhases,
          setActualPhases,
          actualKeyDates,
          setActualKeyDates,
          actualCalc,
        )}
      </div>
    </div>
  )
}
