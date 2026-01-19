"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const businessUnitsData: Record<string, { code: string; name: string; allowableArea: number }> = {
  ELB: { code: "ELB", name: "電気設備ビジネスユニット", allowableArea: 75000 },
  PPB: { code: "PPB", name: "プラントビジネスユニット", allowableArea: 45000 },
  ELA: { code: "ELA", name: "エネルギーソリューションユニット", allowableArea: 60000 },
  ELC: { code: "ELC", name: "環境システムユニット", allowableArea: 35000 },
}

interface BusinessUnitEditContentProps {
  code: string
}

export function BusinessUnitEditContent({ code }: BusinessUnitEditContentProps) {
  const router = useRouter()
  const { toast } = useToast()

  const initialData = businessUnitsData[code] || { code: "", name: "", allowableArea: 0 }

  const [formData, setFormData] = useState({
    code: initialData.code,
    name: initialData.name,
    allowableArea: initialData.allowableArea,
  })

  const handleSave = () => {
    toast({
      title: "保存しました",
      description: `${formData.name}の情報を保存しました`,
    })
  }

  const handleCancel = () => {
    router.push("/business-units")
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">ビジネスユニット</h1>
        <Avatar className="h-10 w-10 bg-muted">
          <AvatarFallback className="text-sm font-medium text-muted-foreground">SN</AvatarFallback>
        </Avatar>
      </div>

      {/* Edit Card */}
      <Card className="bg-white rounded-lg shadow-sm p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground mb-8">{initialData.name || "新規ビジネスユニット"}</h2>

        {/* Form */}
        <div className="space-y-6 max-w-2xl">
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-12">
          <Button onClick={handleSave} className="bg-foreground text-background hover:bg-foreground/90 gap-2">
            <Save className="w-4 h-4" />
            保存
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
        </div>
      </Card>
    </div>
  )
}
