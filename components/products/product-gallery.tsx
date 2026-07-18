"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

const SWIPE_THRESHOLD = 40

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta <= -SWIPE_THRESHOLD) {
      setSelectedImage((prev) => (prev + 1) % images.length)
    } else if (delta >= SWIPE_THRESHOLD) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    }
    touchStartX.current = null
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:gap-4 lg:flex-row">
      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors sm:h-20 sm:w-20",
              selectedImage === index ? "border-foreground" : "border-transparent hover:border-muted-foreground"
            )}
          >
            <Image
              src={image}
              alt={`${productName} - View ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative aspect-3/4 flex-1 overflow-hidden bg-surface-container-low touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 lg:hidden">
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  selectedImage === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
