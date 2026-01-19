"use client"

import { Sidebar } from "@/components/sidebar"
import { ProjectDetailContent } from "@/components/project-detail-content"

interface ProjectDetailLayoutProps {
  projectId: string
}

export function ProjectDetailLayout({ projectId }: ProjectDetailLayoutProps) {
  return (
    <div className="flex h-screen bg-[#E8F1F5]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProjectDetailContent projectId={projectId} />
      </main>
    </div>
  )
}
