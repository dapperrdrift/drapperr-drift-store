import Link from "next/link"
import { MoreVertical, Search, Eye, Truck, CheckCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - will be replaced with database queries
const orders = [
  {
    id: "DD10234567",
    customer: "Priya Sharma",
    email: "priya@example.com",
    items: 2,
    total: 37000,
    status: "placed",
    paymentStatus: "paid",
    date: "Mar 23, 2026",
  },
  {
    id: "DD10234566",
    customer: "Rahul Verma",
    email: "rahul@example.com",
    items: 1,
    total: 12500,
    status: "shipped",
    paymentStatus: "paid",
    date: "Mar 22, 2026",
  },
  {
    id: "DD10234565",
    customer: "Ananya Patel",
    email: "ananya@example.com",
    items: 3,
    total: 35000,
    status: "delivered",
    paymentStatus: "paid",
    date: "Mar 21, 2026",
  },
  {
    id: "DD10234564",
    customer: "Vikram Singh",
    email: "vikram@example.com",
    items: 1,
    total: 8900,
    status: "confirmed",
    paymentStatus: "paid",
    date: "Mar 21, 2026",
  },
  {
    id: "DD10234563",
    customer: "Meera Reddy",
    email: "meera@example.com",
    items: 2,
    total: 18200,
    status: "placed",
    paymentStatus: "pending",
    date: "Mar 20, 2026",
  },
]

const statusColors: Record<string, string> = {
  placed: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
}

const paymentColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
}

export default function AdminOrdersPage() {
  return (
    <div>
      <AdminHeader title="Orders" />
      
      <main className="p-6">
        {/* Filters bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-border px-3 py-2 bg-surface-container-lowest w-full sm:w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                className="flex-1 bg-transparent body-md placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <select className="border border-border px-3 py-2 bg-surface-container-lowest body-md">
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <p className="body-md text-muted-foreground">{orders.length} orders</p>
        </div>

        {/* Orders table */}
        <div className="mt-6 bg-surface-container-lowest border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-container-low">
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-right label-md text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="title-md text-foreground hover:text-primary">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="body-md text-foreground">{order.customer}</p>
                        <p className="body-md text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-muted-foreground">{order.items}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-foreground">Rs. {order.total.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 label-md ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 label-md ${paymentColors[order.paymentStatus]}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-muted-foreground">{order.date}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {order.status === "confirmed" && (
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {order.status === "shipped" && (
                            <DropdownMenuItem className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="body-md text-muted-foreground">
            Showing 1-{orders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
