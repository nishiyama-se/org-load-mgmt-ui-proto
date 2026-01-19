import { AlertTriangle, Triangle } from "lucide-react"

interface StatusCard {
  title: string
  value: number
  description: string
  borderColor: string
  iconColor: string
  iconType: "warning" | "triangle"
}

const statusData: StatusCard[] = [
  {
    title: "期限間近",
    value: 5,
    description: "7日以内に期限を迎えるプロジェクト",
    borderColor: "border-l-[#FFC107]",
    iconColor: "text-[#FFC107]",
    iconType: "warning",
  },
  {
    title: "期限超過",
    value: 3,
    description: "期限を過ぎたプロジェクト",
    borderColor: "border-l-[#F44336]",
    iconColor: "text-[#F44336]",
    iconType: "warning",
  },
  {
    title: "キャパシティ超過",
    value: 1,
    description: "キャパシティを超えている部署",
    borderColor: "border-l-[#7C4DFF]",
    iconColor: "text-[#7C4DFF]",
    iconType: "warning",
  },
  {
    title: "進行中",
    value: 13,
    description: "進行中のプロジェクト",
    borderColor: "border-l-[#4CAF50]",
    iconColor: "text-[#4CAF50]",
    iconType: "triangle",
  },
  {
    title: "完了",
    value: 3,
    description: "当月完了したプロジェクト",
    borderColor: "border-l-[#8BC34A]",
    iconColor: "text-[#8BC34A]",
    iconType: "triangle",
  },
]

export function StatusCards() {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {statusData.map((card) => (
        <div key={card.title} className={`bg-white rounded-lg p-4 border-l-4 ${card.borderColor} shadow-sm`}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-foreground">{card.title}</h3>
            {card.iconType === "warning" ? (
              <AlertTriangle className={`w-5 h-5 ${card.iconColor} fill-current`} />
            ) : (
              <Triangle className={`w-5 h-5 ${card.iconColor} fill-current`} />
            )}
          </div>
          <p className="text-4xl font-bold text-foreground mt-2">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
        </div>
      ))}
    </div>
  )
}
