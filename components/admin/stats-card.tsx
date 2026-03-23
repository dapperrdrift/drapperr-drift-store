import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: "up" | "down"
  }
  icon?: ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-md text-muted-foreground">{title}</p>
          <p className="mt-2 display-md text-foreground">{value}</p>
          {change && (
            <p className={`mt-1 body-md ${change.trend === "up" ? "text-green-600" : "text-destructive"}`}>
              {change.trend === "up" ? "+" : "-"}{Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center bg-surface-container-low">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
