"use client"

import { TechnicalInfoTable } from "@/components/technical-info-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TechnicalInfoContent() {
  return (
    <div className="p-6">
      {/* Header with title and user avatar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">案件技術情報</h1>
        <Avatar className="h-10 w-10 bg-muted">
          <AvatarFallback className="text-sm font-medium text-muted-foreground">SN</AvatarFallback>
        </Avatar>
      </div>
      <TechnicalInfoTable />
    </div>
  )
}
