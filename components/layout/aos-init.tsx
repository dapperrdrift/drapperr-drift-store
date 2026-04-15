"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import AOS from "aos"
import "aos/dist/aos.css"

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    })
  }, [])

  const pathname = usePathname()
  useEffect(() => {
    AOS.refreshHard()
  }, [pathname])

  return null
}
