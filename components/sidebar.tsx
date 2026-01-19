"use client"

import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, List, Download, Settings, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard, href: "/" },
  { id: "projects", label: "案件リスト", icon: List, href: "/projects" },
  { id: "excel", label: "Excelダウンロード", icon: Download, href: "/excel" },
  { id: "business", label: "ビジネスユニット", icon: Settings, href: "/business-units" },
  { id: "system", label: "システム情報", icon: Info, href: "/system" },
]

interface SidebarProps {
  activeItem?: string
}

export function Sidebar({ activeItem }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const currentActiveItem =
    activeItem ||
    (() => {
      if (pathname === "/") return "dashboard"
      if (pathname.startsWith("/projects")) return "projects"
      if (pathname === "/excel") return "excel"
      if (pathname.startsWith("/business-units")) return "business"
      if (pathname === "/system") return "system" // /system パスの判定を追加
      return "dashboard"
    })()

  const handleItemClick = (href: string) => {
    if (href !== "#") {
      router.push(href)
    }
  }

  return (
    <div className="w-[200px] min-w-[200px] shrink-0 bg-white border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#2196F3] shrink-0" />
        <span className="font-medium text-foreground text-sm whitespace-nowrap">案件評価管理</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.href)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1 whitespace-nowrap",
              currentActiveItem === item.id ? "bg-[#2196F3] text-white" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3">
        <div className="flex items-center justify-center gap-1 bg-[#2196F3] rounded-md p-2">
          <button className="p-1 text-white hover:bg-white/20 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-white hover:bg-white/20 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
