"use client"

import { Sidebar } from "@/components/sidebar"
import { BusinessUnitsContent } from "@/components/business-units-content"

export function BusinessUnitsLayout() {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <BusinessUnitsContent />
      </main>
    </div>
  )
}
