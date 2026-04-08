"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./auth-context"

interface WishlistContextType {
  wishlistItems: string[] // Array of product ids
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([])
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id)

      if (error) throw error

      setWishlistItems(data.map((item) => item.product_id))
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const addToWishlist = async (productId: string) => {
    if (!user) {
      // Could redirect to login here, or trigger a toast
      return
    }

    // Optimistic update
    setWishlistItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]))

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId })

      if (error && error.code !== "23505") { // Ignore unique constraint violations
        throw error
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      // Revert optimistic update
      setWishlistItems((prev) => prev.filter((id) => id !== productId))
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    // Optimistic update
    setWishlistItems((prev) => prev.filter((id) => id !== productId))

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (error) throw error
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      // Revert optimistic update
      setWishlistItems((prev) => [...prev, productId])
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
