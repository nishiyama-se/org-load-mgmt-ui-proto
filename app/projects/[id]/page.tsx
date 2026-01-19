import { ProjectDetailPage } from "@/components/project-detail-page"
import { projectData } from "@/lib/projects"

export async function generateStaticParams() {
  return projectData.map((project) => ({
    id: project.id,
  }))
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  return <ProjectDetailPage projectId={id} />
}
