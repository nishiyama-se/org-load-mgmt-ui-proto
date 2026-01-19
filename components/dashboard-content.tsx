"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Edit,
  FileWarning,
  Gauge,
  Minus,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// モックデータ：案件（15件）
const mockProjects = [
  {
    id: "1",
    projectNumber: "J81-009194",
    name: "新横浜工場 水処理設備",
    client: "東洋製造株式会社",
    constructionNumber: "P-8100-485",
    pNumber: "P-8100-485",
    nextKeyDate: "2026-01-20",
    keyDateName: "建築電源申入",
    status: "deteriorating",
    unupdatedDays: 35,
    tags: ["キーデート", "未更新"],
    bu: "ELBU",
  },
  {
    id: "2",
    projectNumber: "J81-009195",
    name: "千葉第二工場 空調更新",
    client: "日本テクノ工業",
    constructionNumber: "P-8100-486",
    pNumber: "P-8100-486",
    nextKeyDate: "2026-01-25",
    keyDateName: "機器搬入",
    status: "improving",
    unupdatedDays: 5,
    tags: [],
    bu: "ELBU",
  },
  {
    id: "3",
    projectNumber: "J81-009196",
    name: "大阪本社ビル 電気設備",
    client: "中部エンジニアリング",
    constructionNumber: "P-8100-487",
    pNumber: "P-8100-487",
    nextKeyDate: "2026-02-01",
    keyDateName: "竣工検査",
    status: "stable",
    unupdatedDays: 12,
    tags: ["高負荷"],
    bu: "PPBU",
  },
  {
    id: "4",
    projectNumber: "J81-009197",
    name: "名古屋研究所 純水装置",
    client: "関西プラント",
    constructionNumber: "P-8100-488",
    pNumber: "P-8100-488",
    nextKeyDate: "2026-01-18",
    keyDateName: "設計承認",
    status: "deteriorating",
    unupdatedDays: 45,
    tags: ["未更新", "不整合"],
    bu: "ELBU",
  },
  {
    id: "5",
    projectNumber: "J81-009198",
    name: "福岡工場 排水処理",
    client: "九州テクノ",
    constructionNumber: "P-8100-489",
    pNumber: "P-8100-489",
    nextKeyDate: "2026-01-30",
    keyDateName: "工事着手",
    status: "stable",
    unupdatedDays: 8,
    tags: [],
    bu: "PPBU",
  },
  {
    id: "6",
    projectNumber: "J81-009199",
    name: "札幌データセンター 冷却設備",
    client: "北海道IT",
    constructionNumber: "P-8100-490",
    pNumber: "P-8100-490",
    nextKeyDate: "2026-02-15",
    keyDateName: "システム納品",
    status: "improving",
    unupdatedDays: 3,
    tags: ["難易度高"],
    bu: "ELBU",
  },
  {
    id: "7",
    projectNumber: "J81-009200",
    name: "仙台物流センター 空調",
    client: "東北ロジ",
    constructionNumber: "P-8100-491",
    pNumber: "P-8100-491",
    nextKeyDate: "2026-01-22",
    keyDateName: "中間検査",
    status: "deteriorating",
    unupdatedDays: 28,
    tags: ["キーデート"],
    bu: "PPBU",
  },
  {
    id: "8",
    projectNumber: "J81-009201",
    name: "横浜港湾施設 電源設備",
    client: "港湾エンジ",
    constructionNumber: "P-8100-492",
    pNumber: "P-8100-492",
    nextKeyDate: "2026-03-01",
    keyDateName: "最終検収",
    status: "stable",
    unupdatedDays: 15,
    tags: [],
    bu: "ELBU",
  },
  {
    id: "9",
    projectNumber: "J81-009202",
    name: "広島工場 超純水システム",
    client: "中国製造",
    constructionNumber: "P-8100-493",
    pNumber: "",
    nextKeyDate: "2026-01-19",
    keyDateName: "P番発行",
    status: "deteriorating",
    unupdatedDays: 60,
    tags: ["ルール逸脱", "未更新"],
    bu: "PPBU",
  },
  {
    id: "10",
    projectNumber: "J81-009203",
    name: "神戸研究施設 廃水処理",
    client: "関西ラボ",
    constructionNumber: "P-8100-494",
    pNumber: "P-8100-494",
    nextKeyDate: "2026-02-10",
    keyDateName: "機器据付",
    status: "improving",
    unupdatedDays: 2,
    tags: [],
    bu: "ELBU",
  },
  {
    id: "1",
    projectNumber: "J81-009204",
    name: "京都半導体工場 純水設備",
    client: "京都セミコン",
    constructionNumber: "P-8100-495",
    pNumber: "P-8100-495",
    nextKeyDate: "2026-01-28",
    keyDateName: "配管施工図",
    status: "stable",
    unupdatedDays: 10,
    tags: [],
    bu: "ELBU",
  },
  {
    id: "2",
    projectNumber: "J81-009205",
    name: "埼玉物流倉庫 空調システム",
    client: "関東物流",
    constructionNumber: "P-8100-496",
    pNumber: "P-8100-496",
    nextKeyDate: "2026-02-05",
    keyDateName: "試運転",
    status: "improving",
    unupdatedDays: 4,
    tags: [],
    bu: "PPBU",
  },
  {
    id: "3",
    projectNumber: "J81-009206",
    name: "長野精密工場 超純水",
    client: "信州精機",
    constructionNumber: "P-8100-497",
    pNumber: "P-8100-497",
    nextKeyDate: "2026-01-21",
    keyDateName: "機器搬入",
    status: "deteriorating",
    unupdatedDays: 32,
    tags: ["未更新", "キーデート"],
    bu: "ELBU",
  },
  {
    id: "4",
    projectNumber: "J81-009207",
    name: "静岡飲料工場 排水処理",
    client: "東海飲料",
    constructionNumber: "P-8100-498",
    pNumber: "P-8100-498",
    nextKeyDate: "2026-02-20",
    keyDateName: "完成検査",
    status: "stable",
    unupdatedDays: 7,
    tags: [],
    bu: "PPBU",
  },
  {
    id: "5",
    projectNumber: "J81-009208",
    name: "岡山化学工場 廃水設備",
    client: "山陽ケミカル",
    constructionNumber: "P-8100-499",
    pNumber: "P-8100-499",
    nextKeyDate: "2026-01-17",
    keyDateName: "設計承認",
    status: "deteriorating",
    unupdatedDays: 40,
    tags: ["未更新", "キーデート"],
    bu: "PPBU",
  },
]

// モックデータ：ToDo（12件）
const mockTodos = [
  {
    id: 1,
    projectId: "1",
    priority: "now",
    type: "キーデート",
    projectName: "新横浜工場 水処理設備",
    title: "建築電源申入（7日以内）",
    instruction: "遵守可否を報告",
    dueDate: "2026-01-20",
  },
  {
    id: 2,
    projectId: "5",
    priority: "now",
    type: "キーデート",
    projectName: "岡山化学工場 廃水設備",
    title: "設計承認（期限超過）",
    instruction: "実績日を入力/遅延報告",
    dueDate: "2026-01-17",
  },
  {
    id: 3,
    projectId: "4",
    priority: "now",
    type: "未更新",
    projectName: "名古屋研究所 純水装置",
    title: "案件技術情報が45日未更新",
    instruction: "更新",
    dueDate: "2026-01-16",
  },
  {
    id: 4,
    projectId: "9",
    priority: "now",
    type: "未更新",
    projectName: "広島工場 超純水システム",
    title: "案件技術情報が60日未更新",
    instruction: "更新",
    dueDate: "2026-01-16",
  },
  {
    id: 5,
    projectId: "4",
    priority: "deadline",
    type: "不整合",
    projectName: "名古屋研究所 純水装置",
    title: "開始日>終了日（フェーズ）",
    instruction: "修正",
    dueDate: "2026-01-20",
  },
  {
    id: 6,
    projectId: "3",
    priority: "now",
    type: "高負荷",
    projectName: "大阪本社ビル 電気設備",
    title: "BU閾値超過",
    instruction: "対処報告",
    dueDate: "2026-01-18",
  },
  {
    id: 7,
    projectId: "9",
    priority: "now",
    type: "ルール逸脱",
    projectName: "広島工場 超純水システム",
    title: "P番未発行",
    instruction: "営業差戻し",
    dueDate: "2026-01-19",
  },
  {
    id: 8,
    projectId: "6",
    priority: "deadline",
    type: "難易度高",
    projectName: "札幌データセンター 冷却設備",
    title: "高難度案件",
    instruction: "上長レビュー依頼",
    dueDate: "2026-01-25",
  },
  {
    id: 9,
    projectId: "7",
    priority: "deadline",
    type: "キーデート",
    projectName: "仙台物流センター 空調",
    title: "中間検査（6日以内）",
    instruction: "準備状況確認",
    dueDate: "2026-01-22",
  },
  {
    id: 10,
    projectId: "3",
    priority: "deadline",
    type: "キーデート",
    projectName: "長野精密工場 超純水",
    title: "機器搬入（5日以内）",
    instruction: "遵守可否を報告",
    dueDate: "2026-01-21",
  },
  {
    id: 11,
    projectId: "2",
    priority: "ongoing",
    type: "継続",
    projectName: "千葉第二工場 空調更新",
    title: "週次進捗報告",
    instruction: "定期報告を更新",
    dueDate: "2026-01-23",
  },
  {
    id: 12,
    projectId: "5",
    priority: "ongoing",
    type: "継続",
    projectName: "福岡工場 排水処理",
    title: "月次レビュー準備",
    instruction: "資料を準備",
    dueDate: "2026-01-30",
  },
]

const kpiData = [
  { key: "deadline_soon", label: "期限間近", sublabel: "7日以内", value: 5, color: "border-l-yellow-500", icon: Clock },
  { key: "overdue", label: "期限超過", sublabel: "", value: 3, color: "border-l-red-500", icon: AlertTriangle },
  {
    key: "bu_overload",
    label: "キャパシティ超過",
    sublabel: "",
    value: 1,
    color: "border-l-purple-500",
    icon: AlertCircle,
  },
  {
    key: "not_updated",
    label: "未更新",
    sublabel: "30日以上",
    value: 5,
    color: "border-l-orange-500",
    icon: RefreshCw,
  },
  { key: "no_actual", label: "実績未入力", sublabel: "", value: 6, color: "border-l-blue-500", icon: FileWarning },
  { key: "violations", label: "ルール逸脱", sublabel: "", value: 1, color: "border-l-red-600", icon: AlertTriangle },
  { key: "high_difficulty", label: "高難度", sublabel: "", value: 1, color: "border-l-pink-500", icon: Gauge },
]

export function DashboardContent() {
  const router = useRouter()
  const [yearMonth, setYearMonth] = useState("2026-01")
  const [businessUnit, setBU] = useState("all")
  const [displayRange, setDisplayRange] = useState("self")
  const [todoFilter, setTodoFilter] = useState("now")
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [todoCollapsed, setTodoCollapsed] = useState(false)
  const [kpiCollapsed, setKpiCollapsed] = useState(false)

  const filteredTodos = mockTodos.filter((todo) => {
    if (todoFilter === "all") return true
    return todo.priority === todoFilter
  })

  const filteredProjects = mockProjects.filter((project) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        project.projectNumber.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    if (selectedKPI) {
      switch (selectedKPI) {
        case "deadline_soon":
          const daysUntil = Math.ceil(
            (new Date(project.nextKeyDate).getTime() - new Date("2026-01-16").getTime()) / (1000 * 60 * 60 * 24),
          )
          return daysUntil > 0 && daysUntil <= 7
        case "overdue":
          return new Date(project.nextKeyDate) < new Date("2026-01-16")
        case "bu_overload":
          return project.tags.includes("高負荷")
        case "not_updated":
          return project.unupdatedDays > 30
        case "no_actual":
          return project.status === "deteriorating"
        case "violations":
          return project.tags.includes("ルール逸脱")
        case "high_difficulty":
          return project.tags.includes("難易度高")
        default:
          return true
      }
    }

    return true
  })

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}?tab=tech&mode=plan`)
  }

  const handleExcelExport = () => {
    router.push("/excel")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "deteriorating":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "improving":
        return "改善"
      case "deteriorating":
        return "悪化"
      default:
        return "横ばい"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "now":
        return "今すぐ"
      case "deadline":
        return "期限までに"
      default:
        return "継続"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "now":
        return "bg-red-100 text-red-800 border-red-300"
      case "deadline":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "キーデート":
        return "bg-blue-100 text-blue-800"
      case "未更新":
        return "bg-orange-100 text-orange-800"
      case "不整合":
        return "bg-purple-100 text-purple-800"
      case "高負荷":
        return "bg-red-100 text-red-800"
      case "ルール逸脱":
        return "bg-red-100 text-red-800"
      case "難易度高":
        return "bg-pink-100 text-pink-800"
      case "継続":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">ダッシュボード</h1>
        <div className="flex items-center gap-3">
          <Input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="w-36 h-8 text-sm bg-white"
          />
          <Select value={businessUnit} onValueChange={setBU}>
            <SelectTrigger className="w-40 h-8 text-sm bg-white">
              <SelectValue placeholder="ビジネスユニット" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全BU</SelectItem>
              <SelectItem value="ELBU">電気設備BU</SelectItem>
              <SelectItem value="PPBU">プラントBU</SelectItem>
            </SelectContent>
          </Select>
          <Select value={displayRange} onValueChange={setDisplayRange}>
            <SelectTrigger className="w-28 h-8 text-sm bg-white">
              <SelectValue placeholder="表示範囲" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">自分</SelectItem>
              <SelectItem value="bu">BU</SelectItem>
              <SelectItem value="all">全体</SelectItem>
            </SelectContent>
          </Select>
          <Avatar className="h-8 w-8 bg-gray-400">
            <AvatarFallback className="text-white text-xs">SN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4 pb-2 space-y-2">
        <Card>
          <CardHeader className="py-2 px-4">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-base flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setTodoCollapsed(!todoCollapsed)}
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                要対応
                {todoCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                )}
              </CardTitle>
              {todoCollapsed && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredTodos.length}件
                </Badge>
              )}
              {!todoCollapsed && (
                <Tabs value={todoFilter} onValueChange={setTodoFilter}>
                  <TabsList className="h-7">
                    <TabsTrigger value="now" className="text-xs px-3 h-6">
                      今すぐ
                    </TabsTrigger>
                    <TabsTrigger value="deadline" className="text-xs px-3 h-6">
                      期限までに
                    </TabsTrigger>
                    <TabsTrigger value="ongoing" className="text-xs px-3 h-6">
                      継続
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </CardHeader>
          {!todoCollapsed && (
            <CardContent className="px-4 pb-2">
              <div className="space-y-0">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-b-0"
                    onClick={() => handleProjectClick(todo.projectId)}
                  >
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(todo.priority)}`}>
                      {getPriorityLabel(todo.priority)}
                    </Badge>
                    <Badge className={`text-[10px] px-1.5 py-0 ${getTypeColor(todo.type)}`}>{todo.type}</Badge>
                    <span className="text-sm text-blue-600 hover:underline min-w-[200px] truncate">
                      {todo.projectName}
                    </span>
                    <span className="text-sm flex-1 truncate text-muted-foreground">
                      {todo.title} → <span className="font-medium text-foreground">{todo.instruction}</span>
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{todo.dueDate}</span>
                    <span className="text-xs text-orange-600 whitespace-nowrap min-w-[60px] text-right">
                      {mockProjects.find((p) => p.id === todo.projectId)?.unupdatedDays || 0}日未更新
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                {filteredTodos.length === 0 && (
                  <div className="text-center text-muted-foreground py-4 text-sm">該当するToDoはありません</div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="py-1.5 px-4">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-sm flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setKpiCollapsed(!kpiCollapsed)}
              >
                KPIサマリー
                {kpiCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                )}
              </CardTitle>
              {selectedKPI && !kpiCollapsed && (
                <button className="text-xs text-blue-600 hover:underline" onClick={() => setSelectedKPI(null)}>
                  フィルタ解除
                </button>
              )}
            </div>
          </CardHeader>
          {!kpiCollapsed && (
            <CardContent className="px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {kpiData.map((kpi) => {
                  const Icon = kpi.icon
                  return (
                    <div
                      key={kpi.key}
                      className={`flex items-center gap-2 px-3 py-2 rounded border-l-4 ${kpi.color} bg-white cursor-pointer hover:shadow transition-shadow text-sm ${selectedKPI === kpi.key ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                      onClick={() => setSelectedKPI(selectedKPI === kpi.key ? null : kpi.key)}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{kpi.label}</span>
                      {kpi.sublabel && <span className="text-xs text-muted-foreground">({kpi.sublabel})</span>}
                      <span className="text-lg font-bold ml-1">{kpi.value}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="py-2 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">案件一覧</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 h-8 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-2 font-medium text-muted-foreground">案件番号</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">案件名</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">納入先</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">次キーデート</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">ヘルス</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">未更新日数</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground">タグ</th>
                    <th className="py-2 px-2 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <td className="py-2 px-2">{project.projectNumber}</td>
                      <td className="py-2 px-2 text-blue-600 hover:underline max-w-[200px] truncate">{project.name}</td>
                      <td className="py-2 px-2">{project.client}</td>
                      <td className="py-2 px-2">
                        <div className="text-xs">
                          <div>{project.nextKeyDate}</div>
                          <div className="text-muted-foreground">{project.keyDateName}</div>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          <span className="text-xs">{getStatusLabel(project.status)}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <span className={project.unupdatedDays > 30 ? "text-red-600 font-medium" : ""}>
                          {project.unupdatedDays}日
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1 flex-wrap">
                          {project.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-blue-600" />
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        該当する案件はありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
