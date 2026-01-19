"use client"

import { BusinessUnitsTable } from "@/components/business-units-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function BusinessUnitsContent() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">ビジネスユニット</h1>
        <Avatar className="h-10 w-10 bg-muted">
          <AvatarFallback className="text-sm font-medium text-muted-foreground">SN</AvatarFallback>
        </Avatar>
      </div>
      <BusinessUnitsTable />
    </div>
  )
}
