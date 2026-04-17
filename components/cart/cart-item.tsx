"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"

interface CartItemProps {
  item: {
    id: string
    product_id: string
    name: string
    slug: string
    image: string | null
    price: number
    size: string
    color: string
    quantity: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 sm:flex-row sm:gap-4 sm:py-6">
      {/* Product image */}
      <Link href={`/products/${item.slug}`} className="relative h-40 w-full shrink-0 overflow-hidden bg-surface-container-low sm:h-32 sm:w-24">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="body-md text-muted-foreground">No image</span>
          </div>
        )}
      </Link>

      {/* Product details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link href={`/products/${item.slug}`} className="title-md text-foreground hover:text-primary transition-colors">
              {item.name}
            </Link>
            <p className="mt-1 body-md text-muted-foreground">
              {item.color} / {item.size}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Remove item"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between sm:mt-auto sm:items-end">
          {/* Quantity selector */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="p-2.5 transition-colors hover:bg-surface-container-low disabled:opacity-50 sm:p-2"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center body-md sm:w-10">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-2.5 transition-colors hover:bg-surface-container-low sm:p-2"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <p className="title-md text-foreground">
            Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  )
}
