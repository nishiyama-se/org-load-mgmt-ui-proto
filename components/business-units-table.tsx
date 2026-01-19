"use client"

import { useState } from "react"
import { Search, Pencil, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface BusinessUnit {
  code: string
  name: string
  allowableArea: number
  header: string
}

const businessUnits: BusinessUnit[] = [
  { code: "ELB", name: "電気設備ビジネスユニット", allowableArea: 75000, header: "" },
  { code: "PPB", name: "プラントビジネスユニット", allowableArea: 45000, header: "" },
  { code: "ELA", name: "エネルギーソリューションユニット", allowableArea: 60000, header: "" },
  { code: "ELC", name: "環境システムユニット", allowableArea: 35000, header: "" },
]

export function BusinessUnitsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ code: "", name: "", allowableArea: 0 })
  const { toast } = useToast()

  const filteredUnits = businessUnits.filter(
    (unit) =>
      unit.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRowClick = (unit: BusinessUnit) => {
    setSelectedUnit(unit)
    setFormData({
      code: unit.code,
      name: unit.name,
      allowableArea: unit.allowableArea,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    toast({
      title: "保存しました",
      description: `${formData.name}の情報を保存しました`,
    })
    setDialogOpen(false)
  }

  const handleCancel = () => {
    setDialogOpen(false)
  }

  return (
    <>
      <Card className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          {/* Toolbar */}
          <div className="flex items-center justify-end mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px] h-9 border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-[#2196F3]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">BUコード</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">許容不可面積</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Header</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr
                    key={unit.code}
                    onClick={() => handleRowClick(unit)}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="py-3 px-4 text-sm text-foreground">{unit.code}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{unit.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{unit.allowableArea.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{unit.header}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(unit)
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[90vw] h-[90vh] max-w-none p-0 overflow-hidden" showCloseButton={false}>
          {selectedUnit && (
            <div className="flex flex-col h-full">
              {/* Dialog Header */}
              <DialogHeader className="px-6 py-4 border-b border-border bg-white">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold">{selectedUnit.name}</DialogTitle>
                  <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-6 bg-white space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm text-muted-foreground">
                    BUコード
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#2196F3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">
                    BU名称
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#2196F3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowableArea" className="text-sm text-muted-foreground">
                    許容不可面積
                  </Label>
                  <Input
                    id="allowableArea"
                    type="number"
                    value={formData.allowableArea}
                    onChange={(e) => setFormData({ ...formData, allowableArea: Number(e.target.value) })}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#2196F3]"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4 border-t border-border bg-white flex justify-end gap-3">
                <Button onClick={handleSave} className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                  <Save className="w-4 h-4" />
                  保存
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
