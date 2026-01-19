import { Sidebar } from "@/components/sidebar"
import { TechnicalInfoContent } from "@/components/technical-info-content"

export function ProjectListLayout() {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TechnicalInfoContent />
      </main>
    </div>
  )
}
