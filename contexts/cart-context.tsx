"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CartItem {
  id: string           // cart_items.id
  variant_id: string
  quantity: number
  product_id: string
  name: string
  slug: string
  price: number
  image: string | null
  size: string
  color: string
  sku: string
  stock_quantity: number
}

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  loading: boolean
  addItem: (variantId: string, qty?: number) => Promise<void>
  updateQty: (cartItemId: string, qty: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const GUEST_CART_KEY = 'dd_guest_cart'

type GuestItem = { variantId: string; qty: number }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCartFromDB = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('cart_items')
      .select(`
        id,
        variant_id,
        quantity,
        variants(
          id, size, color, sku, stock_quantity, price_override,
          products(id, name, slug, images, base_price)
        )
      `)
      .eq('user_id', userId)

    return (data ?? []).map((item: any) => {
      const v = item.variants
      const p = v?.products
      return {
        id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product_id: p?.id ?? '',
        slug: (p?.slug || p?.id) ?? '',
        name: p?.name ?? '',
        price: v?.price_override ?? p?.base_price ?? 0,
        image: p?.images?.[0] ?? null,
        size: v?.size ?? '',
        color: v?.color ?? '',
        sku: v?.sku ?? '',
        stock_quantity: v?.stock_quantity ?? 0,
      } as CartItem
    })
  }, [supabase])

  const loadCart = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Merge guest cart first, then load from DB
      const guestRaw = localStorage.getItem(GUEST_CART_KEY)
      if (guestRaw) {
        const guestItems: GuestItem[] = JSON.parse(guestRaw)
        for (const g of guestItems) {
          await supabase.from('cart_items').upsert(
            { user_id: user.id, variant_id: g.variantId, quantity: g.qty },
            { onConflict: 'user_id,variant_id' }
          )
        }
        localStorage.removeItem(GUEST_CART_KEY)
      }

      const dbItems = await fetchCartFromDB(user.id)
      setItems(dbItems)
    } else {
      // Guest: load from localStorage via variant IDs, enrich from DB
      const guestRaw = localStorage.getItem(GUEST_CART_KEY)
      if (!guestRaw) { setItems([]); setLoading(false); return }

      const guestItems: GuestItem[] = JSON.parse(guestRaw)
      const variantIds = guestItems.map((g) => g.variantId)

      const { data: variantsData } = await supabase
        .from('variants')
        .select('id, size, color, sku, stock_quantity, price_override, products(id, name, slug, images, base_price)')
        .in('id', variantIds)

      const enriched: CartItem[] = (variantsData ?? []).map((v: any) => {
        const guestItem = guestItems.find((g) => g.variantId === v.id)!
        const p = v.products
        return {
          id: v.id,  // use variant_id as local id for guests
          variant_id: v.id,
          quantity: guestItem.qty,
          product_id: p?.id ?? '',
          slug: (p?.slug || p?.id) ?? '',
          name: p?.name ?? '',
          price: v.price_override ?? p?.base_price ?? 0,
          image: p?.images?.[0] ?? null,
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock_quantity: v.stock_quantity,
        }
      })
      setItems(enriched)
    }
    setLoading(false)
  }, [supabase, fetchCartFromDB])

  useEffect(() => {
    loadCart()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadCart()
    })
    return () => listener.subscription.unsubscribe()
  }, [loadCart, supabase.auth])

  const addItem = useCallback(async (variantId: string, qty = 1) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('variant_id', variantId)
        .single()

      if (existing) {
        await supabase.from('cart_items')
          .update({ quantity: existing.quantity + qty })
          .eq('id', existing.id)
      } else {
        await supabase.from('cart_items')
          .insert({ user_id: user.id, variant_id: variantId, quantity: qty })
      }
      const dbItems = await fetchCartFromDB(user.id)
      setItems(dbItems)
    } else {
      const guestRaw = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = guestRaw ? JSON.parse(guestRaw) : []
      const idx = guestItems.findIndex((g) => g.variantId === variantId)
      if (idx >= 0) {
        guestItems[idx].qty += qty
      } else {
        guestItems.push({ variantId, qty })
      }
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
      await loadCart()
    }
  }, [supabase, fetchCartFromDB, loadCart])

  const updateQty = useCallback(async (cartItemId: string, qty: number) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      if (qty <= 0) {
        await supabase.from('cart_items').delete().eq('id', cartItemId)
      } else {
        await supabase.from('cart_items').update({ quantity: qty }).eq('id', cartItemId)
      }
      const dbItems = await fetchCartFromDB(user.id)
      setItems(dbItems)
    } else {
      const guestRaw = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestItem[] = guestRaw ? JSON.parse(guestRaw) : []
      if (qty <= 0) {
        const updated = guestItems.filter((g) => g.variantId !== cartItemId)
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated))
      } else {
        const idx = guestItems.findIndex((g) => g.variantId === cartItemId)
        if (idx >= 0) guestItems[idx].qty = qty
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
      }
      await loadCart()
    }
  }, [supabase, fetchCartFromDB, loadCart])

  const removeItem = useCallback(async (cartItemId: string) => {
    await updateQty(cartItemId, 0)
  }, [updateQty])

  const clearCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id)
    }
    localStorage.removeItem(GUEST_CART_KEY)
    setItems([])
  }, [supabase])

  const count = items.reduce((acc, i) => acc + i.quantity, 0)
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, loading, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
