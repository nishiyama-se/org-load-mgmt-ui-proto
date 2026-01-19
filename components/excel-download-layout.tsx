"use client"

import { Sidebar } from "@/components/sidebar"
import { ExcelDownloadContent } from "@/components/excel-download-content"

export function ExcelDownloadLayout() {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ExcelDownloadContent />
      </main>
    </div>
  )
}
