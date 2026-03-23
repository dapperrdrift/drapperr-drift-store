"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <AdminSidebar />
      <div className="pl-64 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}
