"use client"

import { Sidebar } from "@/components/sidebar"
import { BusinessUnitEditContent } from "@/components/business-unit-edit-content"

interface BusinessUnitEditLayoutProps {
  code: string
}

export function BusinessUnitEditLayout({ code }: BusinessUnitEditLayoutProps) {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <BusinessUnitEditContent code={code} />
      </main>
    </div>
  )
}
