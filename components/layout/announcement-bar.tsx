"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"

const messages = [
  "FREE SHIPPING ON ORDERS ABOVE ₹5,000 · ACROSS INDIA",
  "NEW DROP LIVE · SHOP THE LATEST STREETWEAR FROM KOTA",
  "SHIPS IN 48 HOURS · COD AVAILABLE PAN-INDIA",
  "ORIGINAL DESIGNS · MADE IN INDIA · BORN IN KOTA",
]

const STORAGE_KEY = "dd_announcement_dismissed_v1"

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setVisible(false)
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1")
  }

  if (!mounted || !visible) return null

  return (
    <div className="relative bg-foreground text-background overflow-hidden">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 lg:px-8">
        <div className="flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="text-[0.6rem] sm:text-xs font-semibold uppercase tracking-[0.18em]"
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-1 opacity-60 transition-opacity hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
