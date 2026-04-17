"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Heart, MapPin, LogOut, ChevronRight, Edit2, Loader2, User as UserIcon, Plus, Trash2, Check, X, ShieldCheck, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart-context"

type TabType = "orders" | "wishlist" | "addresses" | "notifications" | "settings"

import { Suspense } from "react"

function AccountContent() {
  const [activeTab, setActiveTab] = useState<TabType>("orders")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [clearingHistory, setClearingHistory] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [addressForm, setAddressForm] = useState({
    type: "home",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    is_default: false
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { addItem } = useCart()

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType
    if (tab && ["orders", "wishlist", "addresses", "notifications", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    async function getAccountData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Parallel fetch for better performance
      const [ordersRes, addressesRes, wishlistRes, notificationsRes] = await Promise.all([
        supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              variants (
                products (
                  name,
                  images
                )
              )
            )
          `)
          .eq("user_id", user.id)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .eq("hidden_by_user" as any, false)
          .order("created_at", { ascending: false }),
        
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false }),

        supabase
          .from("wishlist")
          .select(`
            *,
            products (
              id,
              name,
              base_price,
              images,
              category_id
            )
          `)
          .eq("user_id", user.id),

        supabase
          .from("notifications")
          .select("*")
          .eq("recipient_id", user.id)
          .order("created_at", { ascending: false })
      ])

      if (ordersRes.error) {
        console.error("Failed to fetch orders:", ordersRes.error)
      }
      if (ordersRes.data) setOrders(ordersRes.data)
      if (addressesRes.data) setAddresses(addressesRes.data)
      if (wishlistRes.data) setWishlist(wishlistRes.data)
      if (notificationsRes.data) setNotifications(notificationsRes.data)
      
      setLoading(false)
    }

    getAccountData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...addressForm,
      user_id: user.id
    }

    let error
    if (editingAddress) {
      const { error: err } = await supabase
        .from("addresses")
        .update(payload)
        .eq("id", editingAddress.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from("addresses")
        .insert(payload)
      error = err
    }

    if (error) {
      toast.error("Failed to save address")
      console.error(error)
    } else {
      toast.success(editingAddress ? "Address updated" : "Address added")
      setIsAddressModalOpen(false)
      setEditingAddress(null)
      // Refresh addresses
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
      if (data) setAddresses(data)
    }
    setLoading(false)
  }

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete address")
    } else {
      setAddresses(addresses.filter(a => a.id !== id))
      toast.success("Address deleted")
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)

    if (error) {
      toast.error("Failed to remove from wishlist")
    } else {
      setWishlist(wishlist.filter(w => w.product_id !== productId))
      toast.success("Removed from wishlist")
    }
  }

  const handleAddToCartFromWishlist = async (product: any) => {
    // Fetch a default variant ID
    const { data: variant, error } = await supabase
      .from("variants")
      .select("id")
      .eq("product_id", product.id)
      .limit(1)
      .single()

    if (error || !variant) {
      toast.error("Unable to add this item to cart — no variants found.")
      return
    }

    await addItem(variant.id, 1)
    toast.success("Added to cart!")
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  const clearOrderHistory = async () => {
    setClearingHistory(true)
    try {
      await fetch("/api/orders/clear-history", { method: "POST" })
      setOrders([])
    } finally {
      setClearingHistory(false)
    }
  }

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "settings" as const, label: "Settings", icon: UserIcon },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipping":
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "placed":
      case "payment_pending":
      case "confirmed":
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-2xl font-semibold">
              {user?.email?.[0].toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="headline-md text-foreground">{user?.user_metadata?.full_name || user?.email}</h1>
            <p className="body-md text-muted-foreground">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <Button onClick={handleSignOut} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Tabs and Content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <nav className="no-scrollbar sticky top-header z-20 flex w-full gap-2 overflow-x-auto border-b border-border bg-background/95 px-1 pb-3 pt-1 backdrop-blur-sm md:top-header-offset lg:static lg:block lg:w-auto lg:space-y-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:backdrop-blur-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left transition-colors lg:w-full lg:gap-3 lg:px-4 lg:py-3",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider lg:title-md lg:normal-case lg:tracking-normal">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Content Area */}
        <div className="min-h-100">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="headline-md text-foreground">Your Orders</h2>
                {orders.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
                        <Trash2 className="h-4 w-4" />
                        Clear History
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear order history?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will hide all orders from your view. Your orders are still being processed and tracked — this only clears your history display.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearOrderHistory}
                          disabled={clearingHistory}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {clearingHistory ? "Clearing…" : "Clear History"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <p className="title-md text-foreground">Order #{order.id.slice(0, 8)}</p>
                          <p className="body-md text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn("px-3 py-1 rounded-full body-md capitalize", getStatusColor(order.status))}>
                            {order.status.replace("_", " ")}
                          </span>
                          <span className="title-md text-foreground">
                            Rs. {order.total_amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                        {order.order_items?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative h-16 w-16 rounded overflow-hidden bg-surface-container-low">
                              <Image
                                src={item.variants?.products?.images?.[0] || "/images/placeholder.jpg"}
                                alt={item.variants?.products?.name || "Product"}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              <p className="body-md text-foreground">{item.variants?.products?.name || "Product"}</p>
                              <p className="body-md text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap justify-end gap-3">
                        <Button asChild variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
                          <Link href={`/orders/${order.id}`}>
                            Track Order
                          </Link>
                        </Button>
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
                <div className="text-center py-12 rounded-lg bg-secondary/30 border border-dashed border-border">
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
              {wishlist.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group rounded-lg border border-border overflow-hidden bg-background">
                      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                        <Image
                          src={item.products?.images?.[0] || "/images/placeholder.jpg"}
                          alt={item.products?.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.product_id)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="title-md text-foreground mb-1">{item.products?.name}</h3>
                        <p className="title-md text-primary mb-4">Rs. {item.products?.base_price.toLocaleString("en-IN")}</p>
                        <Button 
                          onClick={() => handleAddToCartFromWishlist(item.products)}
                          className="w-full gap-2"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary/30 border border-dashed border-border">
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
                <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingAddress(null)
                      setAddressForm({
                        type: "home",
                        first_name: "",
                        last_name: "",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        phone: "",
                        is_default: false
                      })
                    }} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-125">
                    <DialogHeader>
                      <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                      <DialogDescription>
                        Fill in the details for your shipping address.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveAddress} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name" 
                            value={addressForm.first_name}
                            onChange={e => setAddressForm({...addressForm, first_name: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name" 
                            value={addressForm.last_name}
                            onChange={e => setAddressForm({...addressForm, last_name: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={addressForm.address}
                          onChange={e => setAddressForm({...addressForm, address: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={addressForm.city}
                            onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={addressForm.state}
                            onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input 
                            id="pincode" 
                            value={addressForm.pincode}
                            onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={addressForm.phone}
                            onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_default"
                          checked={addressForm.is_default}
                          onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="is_default" className="text-sm font-medium leading-none">
                          Set as default address
                        </Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          {editingAddress ? "Update Address" : "Save Address"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {addresses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={cn(
                      "relative rounded-xl border p-6 bg-background transition-shadow hover:shadow-md",
                      addr.is_default ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                    )}>
                      {addr.is_default && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                          <ShieldCheck className="h-3 w-3" />
                          Default
                        </span>
                      )}
                      <div className="mb-4">
                        <p className="title-md text-foreground mb-1 capitalizefont-semibold">
                          {addr.first_name} {addr.last_name}
                        </p>
                        <p className="body-md text-muted-foreground">{addr.address}</p>
                        <p className="body-md text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="body-md text-muted-foreground font-mono mt-1">{addr.phone}</p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingAddress(addr)
                            setAddressForm({
                              ...addr
                            })
                            setIsAddressModalOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary/30 border border-dashed border-border">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="title-md text-foreground mb-2">No addresses saved</p>
                  <p className="body-md text-muted-foreground">Add your shipping addresses here for faster checkout.</p>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="headline-md text-foreground mb-6">Recent Notifications</h2>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 flex items-start gap-4",
                        notif.is_read 
                          ? "bg-background border-border text-muted-foreground" 
                          : "bg-primary/5 border-primary/20 text-foreground ring-1 ring-primary/10"
                      )}
                      onMouseEnter={() => !notif.is_read && markAsRead(notif.id)}
                    >
                      <div className={cn(
                        "p-2 rounded-full",
                        notif.is_read ? "bg-muted" : "bg-primary/20 text-primary"
                      )}>
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={cn(
                            "title-md truncate capitalize",
                            !notif.is_read && "font-bold text-primary"
                          )}>
                            {notif.title}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <p className="body-md line-clamp-2">{notif.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg bg-secondary/30 border border-dashed border-border">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="title-md text-foreground mb-2">No new notifications</p>
                  <p className="body-md text-muted-foreground">We'll notify you about your orders and updates here.</p>
                </div>
              )}
            </div>
          )}
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
                      <p className="body-lg text-foreground">{user?.user_metadata?.full_name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="label-md text-muted-foreground block mb-2">Email</label>
                      <div className="flex items-center gap-2">
                        <p className="body-lg text-foreground">{user?.email}</p>
                        {user?.email_confirmed_at && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                        <DialogDescription>
                          Ensure your new password is at least 6 characters.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        const target = e.target as any
                        const pass = target.newPassword.value
                        const confirm = target.confirmPassword.value
                        if (pass !== confirm) return toast.error("Passwords don't match")
                        const { error } = await supabase.auth.updateUser({ password: pass })
                        if (error) toast.error(error.message)
                        else {
                          toast.success("Password updated successfully!")
                          target.reset()
                        }
                      }} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" required minLength={6} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" required minLength={6} />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Update Password</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
                  <h3 className="title-lg text-destructive mb-2">Delete Account</h3>
                  <p className="body-md text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    Delete Account
                  </Button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>}>
      <AccountContent />
    </Suspense>
  )
}
