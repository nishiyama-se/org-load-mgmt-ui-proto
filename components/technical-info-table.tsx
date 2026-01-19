"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface TechnicalInfo {
  id: string
  projectNumber: string
  projectName: string
  client: string
  constructionNumber: string
  pNumber: string
  orderAmount: number
  cost: number
  orderDate: string
  deliveryDate: string
}

const technicalData: TechnicalInfo[] = [
  {
    id: "1",
    projectNumber: "J81-000123",
    projectName: "新横浜工場 超純水製造設備新設工事",
    client: "東洋製造株式会社",
    constructionNumber: "K-2024-101",
    pNumber: "P-8100-247",
    orderAmount: 8500,
    cost: 5200,
    orderDate: "2026-02-15",
    deliveryDate: "2027-03-01",
  },
  {
    id: "2",
    projectNumber: "J81-000124",
    projectName: "千葉第二工場 排水処理設備更新工事",
    client: "日本テクノ工業",
    constructionNumber: "K-2024-102",
    pNumber: "P-8100-248",
    orderAmount: 4200,
    cost: 2800,
    orderDate: "2026-03-01",
    deliveryDate: "2027-01-15",
  },
  {
    id: "3",
    projectNumber: "J81-000125",
    projectName: "名古屋センター 純水供給配管工事",
    client: "中部エンジニアリング",
    constructionNumber: "K-2024-103",
    pNumber: "P-8100-249",
    orderAmount: 3600,
    cost: 2400,
    orderDate: "2026-04-10",
    deliveryDate: "2026-12-20",
  },
  {
    id: "4",
    projectNumber: "J81-000126",
    projectName: "大阪本社ビル 回収水処理システム導入",
    client: "西日本電設株式会社",
    constructionNumber: "K-2024-104",
    pNumber: "P-8100-250",
    orderAmount: 6800,
    cost: 4100,
    orderDate: "2026-02-28",
    deliveryDate: "2027-02-15",
  },
  {
    id: "5",
    projectNumber: "J81-000127",
    projectName: "福岡研究所 クリーンルーム用超純水設備",
    client: "九州バイオテック",
    constructionNumber: "K-2024-105",
    pNumber: "P-8100-251",
    orderAmount: 12000,
    cost: 7500,
    orderDate: "2026-01-20",
    deliveryDate: "2027-04-01",
  },
  {
    id: "6",
    projectNumber: "J81-000128",
    projectName: "仙台工場 廃水処理プラント改修",
    client: "東北化学工業",
    constructionNumber: "K-2024-106",
    pNumber: "P-8100-252",
    orderAmount: 5500,
    cost: 3600,
    orderDate: "2026-03-15",
    deliveryDate: "2027-01-30",
  },
  {
    id: "7",
    projectNumber: "J81-000129",
    projectName: "札幌物流センター POU設備導入",
    client: "北海道ロジスティクス",
    constructionNumber: "K-2024-107",
    pNumber: "P-8100-253",
    orderAmount: 7200,
    cost: 4800,
    orderDate: "2026-04-01",
    deliveryDate: "2027-02-28",
  },
  {
    id: "8",
    projectNumber: "J81-000130",
    projectName: "広島工場 前処理設備更新工事",
    client: "山陽重工業株式会社",
    constructionNumber: "K-2024-108",
    pNumber: "P-8100-254",
    orderAmount: 4800,
    cost: 3200,
    orderDate: "2026-02-10",
    deliveryDate: "2026-11-30",
  },
  {
    id: "9",
    projectNumber: "J81-000131",
    projectName: "神戸港 工業用水処理設備新設",
    client: "関西港運株式会社",
    constructionNumber: "K-2024-109",
    pNumber: "",
    orderAmount: 9500,
    cost: 6200,
    orderDate: "2026-03-20",
    deliveryDate: "2027-05-15",
  },
  {
    id: "10",
    projectNumber: "J81-000132",
    projectName: "静岡工場 製薬用純水装置増設",
    client: "富士山製薬株式会社",
    constructionNumber: "K-2024-110",
    pNumber: "P-8100-255",
    orderAmount: 6100,
    cost: 3900,
    orderDate: "2026-04-15",
    deliveryDate: "2027-03-10",
  },
]

export function TechnicalInfoTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleEdit = (item: TechnicalInfo) => {
    router.push(`/projects/${item.id}`)
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-end p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-foreground font-medium">案件番号</TableHead>
              <TableHead className="text-foreground font-medium">案件名</TableHead>
              <TableHead className="text-foreground font-medium">納入先</TableHead>
              <TableHead className="text-foreground font-medium">工事番号</TableHead>
              <TableHead className="text-foreground font-medium">P番</TableHead>
              <TableHead className="text-foreground font-medium">受注額(M¥)</TableHead>
              <TableHead className="text-foreground font-medium">原価(M¥)</TableHead>
              <TableHead className="text-foreground font-medium">受注日</TableHead>
              <TableHead className="text-foreground font-medium">納入日</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicalData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleEdit(item)}>
                <TableCell>{item.projectNumber}</TableCell>
                <TableCell>{item.projectName}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.constructionNumber}</TableCell>
                <TableCell>{item.pNumber || "-"}</TableCell>
                <TableCell>{item.orderAmount.toLocaleString()}</TableCell>
                <TableCell>{item.cost.toLocaleString()}</TableCell>
                <TableCell>{item.orderDate}</TableCell>
                <TableCell>{item.deliveryDate}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(item)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
