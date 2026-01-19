"use client"

import { useState } from "react"
import { Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export function ExcelDownloadContent() {
  const [businessUnit, setBusinessUnit] = useState<string>("")
  const [yearMonth, setYearMonth] = useState<string>("")
  const [isYearMonthMode, setIsYearMonthMode] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    if (!isYearMonthMode) {
      // 最新取得モード
      toast({
        title: "ダウンロード開始（ダミー）",
        description: "事前生成済みのExcelファイルをダウンロードします。",
      })
    } else {
      // 年月指定モード
      toast({
        title: "生成＆ダウンロード開始（ダミー）",
        description: `${businessUnit || "指定BU"} ${yearMonth || "指定年月"} のExcelを生成してダウンロードします。`,
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-semibold text-foreground">Excelダウンロード</h1>
        <Avatar className="h-10 w-10 bg-muted">
          <AvatarFallback className="text-sm font-medium text-muted-foreground">SN</AvatarFallback>
        </Avatar>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
          <div className="space-y-4">
            {/* Business Unit Select */}
            <Select value={businessUnit} onValueChange={setBusinessUnit} disabled={!isYearMonthMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ビジネスユニット" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ELB">電気設備ビジネスユニット</SelectItem>
                <SelectItem value="PPB">プラントビジネスユニット</SelectItem>
                <SelectItem value="ELA">エネルギーソリューションユニット</SelectItem>
                <SelectItem value="ELC">環境システムユニット</SelectItem>
              </SelectContent>
            </Select>

            {/* Year-Month Input */}
            <div className="relative">
              <input
                type="month"
                value={yearMonth}
                onChange={(e) => setYearMonth(e.target.value)}
                placeholder="年月"
                disabled={!isYearMonthMode}
                className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!yearMonth && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                  年月
                </span>
              )}
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Download Button and Toggle */}
            <div className="flex items-center gap-4 pt-2">
              <Button onClick={handleDownload} className="bg-[#1a1a1a] hover:bg-[#333] text-white">
                <Download className="w-4 h-4 mr-2" />
                {isYearMonthMode ? "生成してダウンロード" : "EXCELをダウンロードする"}
              </Button>

              <div className="flex items-center gap-2">
                <Switch id="year-month-mode" checked={isYearMonthMode} onCheckedChange={setIsYearMonthMode} />
                <Label htmlFor="year-month-mode" className="text-sm text-muted-foreground">
                  {isYearMonthMode ? "年月指定" : "最新取得"}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
