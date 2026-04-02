import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/notifications — returns unread count + recent notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") ?? "20")

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const unreadCount = data?.filter((n) => !n.is_read).length ?? 0

    return NextResponse.json({ notifications: data ?? [], unreadCount })
  } catch (err) {
    console.error("GET /api/notifications error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/notifications — mark one or all notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, markAll } = body

    if (markAll) {
      // Mark all unread notifications for this user as read
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, message: "All notifications marked as read" })
    }

    if (!id) {
      return NextResponse.json({ error: "Either id or markAll is required" }, { status: 400 })
    }

    // Mark a specific notification as read — only if it belongs to the user
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("recipient_id", user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("PATCH /api/notifications error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
