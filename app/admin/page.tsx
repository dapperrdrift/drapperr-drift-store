import Link from "next/link"
import { Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"

// Mock data - will be replaced with database queries
const recentOrders = [
  { id: "DD10234567", customer: "Priya Sharma", total: 24500, status: "placed", date: "2 mins ago" },
  { id: "DD10234566", customer: "Rahul Verma", total: 12500, status: "shipped", date: "1 hour ago" },
  { id: "DD10234565", customer: "Ananya Patel", total: 35000, status: "delivered", date: "3 hours ago" },
  { id: "DD10234564", customer: "Vikram Singh", total: 8900, status: "confirmed", date: "5 hours ago" },
  { id: "DD10234563", customer: "Meera Reddy", total: 18200, status: "placed", date: "6 hours ago" },
]

const lowStockItems = [
  { name: "Cashmere Knit Sweater", variant: "Cream / XL", stock: 3 },
  { name: "Tailored Wool Blazer", variant: "Charcoal / L", stock: 2 },
  { name: "Silk Wide-Leg Trousers", variant: "Beige / S", stock: 4 },
]

const statusColors: Record<string, string> = {
  placed: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
}

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader title="Dashboard" />
      
      <main className="p-6">
        {/* Stats grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="Rs. 4,52,300"
            change={{ value: 12.5, trend: "up" }}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Orders"
            value="156"
            change={{ value: 8.2, trend: "up" }}
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Products"
            value="48"
            change={{ value: 4, trend: "up" }}
            icon={<Package className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Low Stock Items"
            value="7"
            icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="title-lg text-foreground">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 label-md text-primary hover:underline"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="title-md text-foreground">{order.id}</p>
                    <p className="body-md text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="title-md text-foreground">Rs. {order.total.toLocaleString("en-IN")}</p>
                    <span className={`inline-block px-2 py-0.5 label-md ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock alerts */}
          <div className="bg-surface-container-lowest border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="title-lg text-foreground">Low Stock Alerts</h2>
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-1 label-md text-primary hover:underline"
              >
                Manage
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-4">
                  <p className="title-md text-foreground">{item.name}</p>
                  <p className="body-md text-muted-foreground">{item.variant}</p>
                  <p className="mt-1 body-md text-destructive">
                    Only {item.stock} left
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
