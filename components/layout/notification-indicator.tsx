"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface NotificationIndicatorProps {
  scrolled: boolean
}

export function NotificationIndicator({ scrolled }: NotificationIndicatorProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    async function getUnreadCount() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false)

      setUnreadCount(count || 0)

      // Subscribe to new notifications
      const channel = supabase
        .channel("realtime-notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `recipient_id=eq.${user.id}`,
          },
          () => {
            setUnreadCount((prev) => prev + 1)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    getUnreadCount()
  }, [supabase])

  return (
    <Link 
      href="/account?tab=notifications" 
      className={cn(
        "relative p-2 rounded-full transition-colors duration-300",
        !scrolled
          ? "text-white hover:text-white hover:bg-white/20"
          : "text-foreground hover:text-primary"
      )}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  )
}
