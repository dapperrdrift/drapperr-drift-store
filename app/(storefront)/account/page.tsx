"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock user data
const mockUser = {
  name: "Arjun Sharma",
  email: "arjun.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: null,
  memberSince: "January 2024",
}

// Mock orders
const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "March 15, 2024",
    status: "Delivered",
    total: 24500,
    items: [
      { name: "Cashmere Knit Sweater", image: "/images/product-1.jpg", quantity: 1 },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "March 8, 2024",
    status: "In Transit",
    total: 35000,
    items: [
      { name: "Camel Wool Overcoat", image: "/images/product-6.jpg", quantity: 1 },
    ],
  },
]

// Mock addresses
const savedAddresses = [
  {
    id: "1",
    name: "Home",
    address: "42, Park Street, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    isDefault: true,
  },
  {
    id: "2",
    name: "Office",
    address: "WeWork, DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    isDefault: false,
  },
]

// Mock wishlist
const wishlistItems = [
  { id: "2", name: "Tailored Wool Blazer", price: 24500, image: "/images/product-2.jpg", slug: "tailored-wool-blazer" },
  { id: "3", name: "Silk Wide-Leg Trousers", price: 8900, image: "/images/product-3.jpg", slug: "silk-wide-leg-trousers" },
]

type TabType = "orders" | "wishlist" | "addresses" | "settings"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("orders")
  const [isEditing, setIsEditing] = useState(false)

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "settings" as const, label: "Settings", icon: User },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-2xl font-semibold">
              {mockUser.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h1 className="headline-md text-foreground">{mockUser.name}</h1>
            <p className="body-md text-muted-foreground">Member since {mockUser.memberSince}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Tabs and Content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="title-md">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="headline-md text-foreground mb-6">Your Orders</h2>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <p className="title-md text-foreground">{order.id}</p>
                          <p className="body-md text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn("px-3 py-1 rounded-full body-md", getStatusColor(order.status))}>
                            {order.status}
                          </span>
                          <span className="title-md text-foreground">
                            Rs. {order.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative h-16 w-16 rounded overflow-hidden bg-surface-container-low">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              <p className="body-md text-foreground">{item.name}</p>
                              <p className="body-md text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link 
                          href={`/orders/${order.id}`}
                          className="flex items-center gap-1 text-primary body-md hover:underline"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="title-md text-foreground mb-2">No orders yet</p>
                  <p className="body-md text-muted-foreground mb-4">Start shopping to see your orders here.</p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              <h2 className="headline-md text-foreground mb-6">Your Wishlist</h2>
              {wishlistItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-lg border border-border p-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-surface-container-low">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <Link href={`/products/${item.slug}`} className="title-md text-foreground hover:text-primary">
                            {item.name}
                          </Link>
                          <p className="body-md text-primary font-medium mt-1">
                            Rs. {item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" className="text-muted-foreground">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="title-md text-foreground mb-2">Your wishlist is empty</p>
                  <p className="body-md text-muted-foreground mb-4">Save items you love for later.</p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="headline-md text-foreground">Saved Addresses</h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Add New Address
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {savedAddresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={cn(
                      "rounded-lg border p-4",
                      address.isDefault ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="title-md text-foreground">{address.name}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground label-md text-[10px]">
                            Default
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="body-md text-muted-foreground">
                      {address.address}<br />
                      {address.city}, {address.state} {address.pincode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="headline-md text-foreground mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="title-lg text-foreground">Personal Information</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-md text-muted-foreground block mb-2">Full Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={mockUser.name}
                          className="w-full border border-input rounded-md px-3 py-2 body-md focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <p className="body-lg text-foreground">{mockUser.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="label-md text-muted-foreground block mb-2">Email</label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          defaultValue={mockUser.email}
                          className="w-full border border-input rounded-md px-3 py-2 body-md focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <p className="body-lg text-foreground">{mockUser.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="label-md text-muted-foreground block mb-2">Phone</label>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          defaultValue={mockUser.phone}
                          className="w-full border border-input rounded-md px-3 py-2 body-md focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <p className="body-lg text-foreground">{mockUser.phone}</p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border p-6">
                  <h3 className="title-lg text-foreground mb-4">Password</h3>
                  <p className="body-md text-muted-foreground mb-4">
                    Change your password to keep your account secure.
                  </p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Change Password
                  </Button>
                </div>

                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
                  <h3 className="title-lg text-destructive mb-2">Delete Account</h3>
                  <p className="body-md text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
