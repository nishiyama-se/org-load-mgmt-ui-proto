"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectInfoTabProps {
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

function CompactField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground truncate">{value || "-"}</span>
    </div>
  )
}

function FormField({
  label,
  children,
  className = "",
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>
      {children}
    </div>
  )
}

export function ProjectInfoTab({ project }: ProjectInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3 bg-gray-400 rounded-full" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            参照情報（編集不可）
          </span>
        </div>

        {/* 基本情報 */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-[10px] text-muted-foreground mb-2 font-medium">基本情報</div>
          <div className="grid grid-cols-8 gap-3">
            <CompactField label="案件番号" value={project.projectNumber} />
            <CompactField label="工事番号" value={project.constructionNumber} />
            <CompactField label="P番" value={project.pNumber} />
            <CompactField label="P番の未発行理由" value={project.pNumberReason} />
            <CompactField label="受注先名" value={project.orderClientName} />
            <CompactField label="納入先名" value={project.deliveryClientName} />
            <CompactField label="納入先事業所" value={project.deliveryOffice} />
            <CompactField label="案件名" value={project.projectName} />
          </div>
        </div>

        {/* 金額・年度・主要日付 */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-[10px] text-muted-foreground mb-2 font-medium">金額・年度・主要日付</div>
          <div className="grid grid-cols-10 gap-3">
            <CompactField label="受注額(M¥)" value={project.orderAmount.toLocaleString()} />
            <CompactField label="原価(M¥)" value={project.cost.toLocaleString()} />
            <CompactField label="予想粗利(M¥)" value={project.expectedProfit.toLocaleString()} />
            <CompactField label="予想粗利率(%)" value={`${project.expectedProfitRate}%`} />
            <CompactField label="受注年度" value={project.orderYear} />
            <CompactField label="売上年度" value={project.salesYear} />
            <CompactField label="受注予定日" value={project.expectedOrderDate} />
            <CompactField label="納入予定日" value={project.expectedDeliveryDate} />
            <CompactField label="受注日" value={project.orderDate} />
            <CompactField label="納入日" value={project.deliveryDate} />
          </div>
        </div>

        {/* 受注難度／運用フラグ */}
        <div>
          <div className="text-[10px] text-muted-foreground mb-2 font-medium">受注難度／運用フラグ</div>
          <div className="grid grid-cols-9 gap-3">
            <CompactField label="案件対応部門" value={project.department} />
            <CompactField label="技術部門会社の評価" value={project.techEvaluation} />
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

      {/* 計画者入力 */}
      <div className="bg-white rounded-lg p-5 border-2 border-[#2196F3]/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-[#2196F3] rounded-full" />
          <span className="text-xs text-[#2196F3] font-medium">計画者入力</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-5">
          <p className="text-xs text-amber-700">
            案件の詳細が未確定で情報を入力できない場合は、「案件情報未確定」を「1」としてください。
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <FormField label="入力担当者">
            <Select defaultValue={project.inputPerson}>
              <SelectTrigger className="h-9 bg-white border-[#2196F3]/50 focus:border-[#2196F3]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="田中 健一">田中 健一</SelectItem>
                <SelectItem value="鈴木 美咲">鈴木 美咲</SelectItem>
                <SelectItem value="高橋 大輔">高橋 大輔</SelectItem>
                <SelectItem value="佐藤 優子">佐藤 優子</SelectItem>
                <SelectItem value="山田 太郎">山田 太郎</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="案件情報未確定">
            <Select defaultValue={project.projectUncertain}>
              <SelectTrigger className="h-9 bg-white border-[#2196F3]/50 focus:border-[#2196F3]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - 確定</SelectItem>
                <SelectItem value="1">1 - 未確定</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="備考" className="col-span-2">
            <Textarea
              defaultValue={project.remarks}
              className="min-h-[80px] resize-none bg-white border-[#2196F3]/50 focus:border-[#2196F3]"
              placeholder="補足情報、注意事項など..."
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
