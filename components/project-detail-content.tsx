"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectInfoTab } from "@/components/project-info-tab"
import { TechnicalInfoTab } from "@/components/technical-info-tab"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ProjectDetailContentProps {
  projectId: string
}

// Mock data
const mockProject = {
  id: "1",
  projectName: "新横浜工場 水処理設備増設工事",
  projectNumber: "A24-001234",
  constructionNumber: "K-2024-101",
  pNumber: "P-2024-101",
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
  expectedOrderDate: "2026-02-10",
  expectedDeliveryDate: "2027-03-01",
  orderDate: "2026-02-15",
  deliveryDate: "2027-03-01",
  completionDate: "",
  department: "ELB",
  techEvaluation: "A",
  controlCompany: "自社",
  constructionCompany: "協力会社",
  orderProbability: "80%",
  priority: "高",
  managementStatus: "進行中",
  reportFlag: "1",
  invoiceFlag: "0",
  inputPerson: "田中 健一",
  projectUncertain: "0",
  remarks: "既存設備の増設工事。純水製造装置の設計・製作・据付を含む。",
}

export function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const [activeTab, setActiveTab] = useState<"project" | "technical">("project")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "保存しました",
      description: "案件情報が正常に保存されました。",
    })
  }

  const handleCancel = () => {
    toast({
      title: "キャンセルしました",
      description: "変更は保存されませんでした。",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">案件技術情報</h1>
        <Avatar className="h-10 w-10 bg-muted">
          <AvatarFallback className="text-sm font-medium text-muted-foreground">SN</AvatarFallback>
        </Avatar>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-lg border border-border shadow-sm min-h-full flex flex-col">
          {/* Project Title */}
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-2xl font-semibold text-foreground">{mockProject.projectName}</h2>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-border">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("project")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "project" ? "text-[#2196F3]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                案件情報
                {activeTab === "project" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2196F3]" />}
              </button>
              <button
                onClick={() => setActiveTab("technical")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "technical" ? "text-[#2196F3]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                技術情報
                {activeTab === "technical" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2196F3]" />}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "project" ? <ProjectInfoTab project={mockProject} /> : <TechnicalInfoTab />}
          </div>

          {/* Fixed Buttons */}
          <div className="px-6 py-4 border-t border-border bg-white flex justify-end gap-3">
            <Button onClick={handleSave} className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white px-6">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button onClick={handleCancel} variant="outline" className="px-6 bg-transparent">
              キャンセル
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
