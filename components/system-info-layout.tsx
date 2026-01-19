"use client"

import { Sidebar } from "@/components/sidebar"
import { SystemInfoContent } from "@/components/system-info-content"

export function SystemInfoLayout() {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <SystemInfoContent />
      </main>
    </div>
  )
}
