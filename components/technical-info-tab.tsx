"use client"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const systemOptions = ["前処理", "純水", "超純水", "回収", "廃水", "POU"] as const

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

const initialSystemData: SystemInputData = {
  volume: 320,
  area: 1200,
  floors: 3,
  congestion: "有",
  period: 8,
  priorityLine: "有",
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

function getCoefficientColor(coef: number): string {
  if (coef > 1.0) return "text-red-600 bg-red-50"
  return "text-gray-500 bg-gray-50"
}

function CoefficientBadge({ value }: { value: number }) {
  return (
    <span className={`text-[9px] px-1 py-0.5 rounded ${getCoefficientColor(value)} font-medium`}>
      ×{value.toFixed(1)}
    </span>
  )
}

// 計画または実績の入力パネル
function DataPanel({
  type,
  selectedSystems,
  setSelectedSystems,
  systemData,
  setSystemData,
  phases,
  setPhases,
  keyDates,
  setKeyDates,
  calculatedValues,
}: {
  type: "plan" | "actual"
  selectedSystems: string[]
  setSelectedSystems: (systems: string[]) => void
  systemData: SystemInputData
  setSystemData: (data: SystemInputData) => void
  phases: PhaseData[]
  setPhases: (data: PhaseData[]) => void
  keyDates: KeyDateData[]
  setKeyDates: (data: KeyDateData[]) => void
  calculatedValues: {
    density: string
    volumeCoef: number
    areaCoef: number
    densityCoef: number
    floorsCoef: number
    congestionCoef: number
    periodCoef: number
    priorityCoef: number
    overallCoef: number
    evalArea: number
  }
}) {
  const isPlan = type === "plan"
  const colorClass = isPlan ? "blue" : "green"
  const bgClass = isPlan ? "bg-blue-50" : "bg-green-50"
  const borderClass = isPlan ? "border-blue-200" : "border-green-200"
  const textClass = isPlan ? "text-blue-700" : "text-green-700"

  const toggleSystem = (system: string) => {
    setSelectedSystems(
      selectedSystems.includes(system) ? selectedSystems.filter((s) => s !== system) : [...selectedSystems, system],
    )
  }

  const updatePhase = (index: number, field: "start" | "end", value: string) => {
    const newPhases = [...phases]
    newPhases[index] = { ...newPhases[index], [field]: value }
    setPhases(newPhases)
  }

  const updateKeyDate = (index: number, value: string) => {
    const newDates = [...keyDates]
    newDates[index] = { ...newDates[index], date: value }
    setKeyDates(newDates)
  }

  return (
    <div className={`${bgClass} rounded-lg p-3 border ${borderClass} flex-1 min-w-0`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <h3 className={`text-sm font-bold ${textClass}`}>{isPlan ? "計画" : "実績"}</h3>
        <div className="flex items-center gap-3 text-[10px] text-gray-600">
          <span>
            総合難易度:{" "}
            <span className={`font-bold ${calculatedValues.overallCoef > 1 ? "text-red-600" : "text-gray-700"}`}>
              ×{calculatedValues.overallCoef.toFixed(2)}
            </span>
          </span>
          <span>
            評価施工面積: <span className="font-medium">{calculatedValues.evalArea}m²</span>
          </span>
        </div>
      </div>

      {/* システム内容 */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-700 mb-1.5">システム内容</div>

        {/* システム選択 */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 p-1.5 bg-white rounded border">
          {systemOptions.map((system) => (
            <label key={system} className="flex items-center gap-1 cursor-pointer">
              <Checkbox
                checked={selectedSystems.includes(system)}
                onCheckedChange={() => toggleSystem(system)}
                className="h-3 w-3"
              />
              <span className="text-[10px]">{system}</span>
            </label>
          ))}
        </div>

        {/* 入力項目 - 2行3列 */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">配管vol.</label>
            <Input
              type="number"
              value={systemData.volume}
              onChange={(e) => setSystemData({ ...systemData, volume: Number(e.target.value) })}
              className="h-6 text-[10px] w-16"
            />
            <CoefficientBadge value={calculatedValues.volumeCoef} />
          </div>

          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">施工面積</label>
            <Input
              type="number"
              value={systemData.area}
              onChange={(e) => setSystemData({ ...systemData, area: Number(e.target.value) })}
              className="h-6 text-[10px] w-16"
            />
            <CoefficientBadge value={calculatedValues.areaCoef} />
          </div>

          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">配管密度</label>
            <div className="h-6 flex items-center px-1 bg-gray-100 rounded text-[10px] border w-16">
              {calculatedValues.density}
            </div>
            <CoefficientBadge value={calculatedValues.densityCoef} />
          </div>

          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">階層</label>
            <Input
              type="number"
              value={systemData.floors}
              onChange={(e) => setSystemData({ ...systemData, floors: Number(e.target.value) })}
              className="h-6 text-[10px] w-16"
            />
            <CoefficientBadge value={calculatedValues.floorsCoef} />
          </div>

          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">他業者輻輳</label>
            <Select
              value={systemData.congestion}
              onValueChange={(v) => setSystemData({ ...systemData, congestion: v })}
            >
              <SelectTrigger className="h-6 text-[10px] w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="有">有</SelectItem>
                <SelectItem value="無">無</SelectItem>
              </SelectContent>
            </Select>
            <CoefficientBadge value={calculatedValues.congestionCoef} />
          </div>

          <div className="flex items-center gap-1">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">工事期間</label>
            <Input
              type="number"
              value={systemData.period}
              onChange={(e) => setSystemData({ ...systemData, period: Number(e.target.value) })}
              className="h-6 text-[10px] w-16"
            />
            <CoefficientBadge value={calculatedValues.periodCoef} />
          </div>

          <div className="flex items-center gap-1 col-span-3">
            <label className="text-[9px] text-gray-600 w-16 shrink-0">優先施工</label>
            <Select
              value={systemData.priorityLine}
              onValueChange={(v) => setSystemData({ ...systemData, priorityLine: v })}
            >
              <SelectTrigger className="h-6 text-[10px] w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="有">有</SelectItem>
                <SelectItem value="無">無</SelectItem>
              </SelectContent>
            </Select>
            <CoefficientBadge value={calculatedValues.priorityCoef} />
          </div>
        </div>
      </div>

      {/* フェーズ */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-700 mb-1.5">フェーズ</div>
        <div className="bg-white rounded border p-1.5 space-y-1">
          {phases.map((phase, index) => (
            <div key={phase.phase} className="flex items-center gap-1">
              <span className="text-[9px] text-gray-700 w-14 shrink-0">{phase.phase}</span>
              <Input
                type="date"
                value={phase.start}
                onChange={(e) => updatePhase(index, "start", e.target.value)}
                className="h-5 text-[9px] flex-1"
              />
              <span className="text-[9px] text-gray-400">〜</span>
              <Input
                type="date"
                value={phase.end}
                onChange={(e) => updatePhase(index, "end", e.target.value)}
                className="h-5 text-[9px] flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* キーデート */}
      <div>
        <div className="text-[10px] font-semibold text-gray-700 mb-1.5">キーデート</div>
        <div className="bg-white rounded border p-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
          {keyDates.map((keyDate, index) => (
            <div key={keyDate.item} className="flex items-center gap-1">
              <span className="text-[9px] text-gray-700 w-20 shrink-0 truncate" title={keyDate.item}>
                {keyDate.item}
              </span>
              <Input
                type="date"
                value={keyDate.date}
                onChange={(e) => updateKeyDate(index, e.target.value)}
                className="h-5 text-[9px] flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TechnicalInfoTab() {
  // 計画データ
  const [planSystems, setPlanSystems] = useState<string[]>(["前処理", "純水", "超純水"])
  const [planSystemData, setPlanSystemData] = useState<SystemInputData>(initialSystemData)
  const [planPhases, setPlanPhases] = useState<PhaseData[]>(initialPlanPhases)
  const [planKeyDates, setPlanKeyDates] = useState<KeyDateData[]>(initialPlanKeyDates)

  // 実績データ
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

  // 計算値
  const planCalculated = useMemo(() => {
    const density = planSystemData.area > 0 ? planSystemData.volume / planSystemData.area : 0
    const volumeCoef = calculateDifficultyCoefficient(planSystemData.volume, "volume")
    const areaCoef = calculateDifficultyCoefficient(planSystemData.area, "area")
    const densityCoef = calculateDifficultyCoefficient(density, "density")
    const floorsCoef = calculateDifficultyCoefficient(planSystemData.floors, "floors")
    const congestionCoef = calculateDifficultyCoefficient(planSystemData.congestion === "有" ? 1 : 0, "congestion")
    const periodCoef = calculateDifficultyCoefficient(planSystemData.period, "period")
    const priorityCoef = calculateDifficultyCoefficient(planSystemData.priorityLine === "有" ? 1 : 0, "priority")
    const overallCoef = volumeCoef * areaCoef * densityCoef * floorsCoef * congestionCoef * periodCoef * priorityCoef
    const evalArea = Math.round(planSystemData.area * overallCoef)

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
      evalArea,
    }
  }, [planSystemData])

  const actualCalculated = useMemo(() => {
    const density = actualSystemData.area > 0 ? actualSystemData.volume / actualSystemData.area : 0
    const volumeCoef = calculateDifficultyCoefficient(actualSystemData.volume, "volume")
    const areaCoef = calculateDifficultyCoefficient(actualSystemData.area, "area")
    const densityCoef = calculateDifficultyCoefficient(density, "density")
    const floorsCoef = calculateDifficultyCoefficient(actualSystemData.floors, "floors")
    const congestionCoef = calculateDifficultyCoefficient(actualSystemData.congestion === "有" ? 1 : 0, "congestion")
    const periodCoef = calculateDifficultyCoefficient(actualSystemData.period, "period")
    const priorityCoef = calculateDifficultyCoefficient(actualSystemData.priorityLine === "有" ? 1 : 0, "priority")
    const overallCoef = volumeCoef * areaCoef * densityCoef * floorsCoef * congestionCoef * periodCoef * priorityCoef
    const evalArea = Math.round(actualSystemData.area * overallCoef)

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
      evalArea,
    }
  }, [actualSystemData])

  return (
    <div className="flex gap-3">
      {/* 計画パネル */}
      <DataPanel
        type="plan"
        selectedSystems={planSystems}
        setSelectedSystems={setPlanSystems}
        systemData={planSystemData}
        setSystemData={setPlanSystemData}
        phases={planPhases}
        setPhases={setPlanPhases}
        keyDates={planKeyDates}
        setKeyDates={setPlanKeyDates}
        calculatedValues={planCalculated}
      />

      {/* 実績パネル */}
      <DataPanel
        type="actual"
        selectedSystems={actualSystems}
        setSelectedSystems={setActualSystems}
        systemData={actualSystemData}
        setSystemData={setActualSystemData}
        phases={actualPhases}
        setPhases={setActualPhases}
        keyDates={actualKeyDates}
        setKeyDates={setActualKeyDates}
        calculatedValues={actualCalculated}
      />
    </div>
  )
}
