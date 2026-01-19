"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { projectData, Project } from "@/lib/projects"

export function ProjectTable() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-white rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-end p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-foreground font-medium">案件番号</TableHead>
              <TableHead className="text-foreground font-medium">案件名</TableHead>
              <TableHead className="text-foreground font-medium">納入先</TableHead>
              <TableHead className="text-foreground font-medium">工事番号</TableHead>
              <TableHead className="text-foreground font-medium">P番</TableHead>
              <TableHead className="text-foreground font-medium">受注額(M¥)</TableHead>
              <TableHead className="text-foreground font-medium">原価(M¥)</TableHead>
              <TableHead className="text-foreground font-medium">受注日</TableHead>
              <TableHead className="text-foreground font-medium">納入日</TableHead>
              <TableHead className="text-foreground font-medium">案件対応部署</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectData.map((project) => (
              <TableRow key={project.id} className="hover:bg-muted/50">
                <TableCell>{project.projectNumber}</TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{project.constructionNumber}</TableCell>
                <TableCell>{project.pNumber}</TableCell>
                <TableCell>{project.orderAmount}</TableCell>
                <TableCell>{project.cost}</TableCell>
                <TableCell>{project.orderDate}</TableCell>
                <TableCell>{project.deliveryDate}</TableCell>
                <TableCell>{project.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
