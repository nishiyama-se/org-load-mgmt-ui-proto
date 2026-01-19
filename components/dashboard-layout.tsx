"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </div>
  )
}
