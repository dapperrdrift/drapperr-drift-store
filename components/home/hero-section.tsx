"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

const slides = [
  {
    id: 1,
    image: "/images/hero-funky.jpg",
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
  },
]

const staticContent = {
  badge: "New Season Drop",
  headline1: "Bold Moves.",
  headline2: "Bolder Style.",
  body: "Fashion isn't just what you wear — it's how you own the room. Discover pieces that speak before you do.",
  ctaPrimary: { label: "Explore Collection", href: "/products" },
  ctaSecondary: { label: "New Arrivals", href: "/products?filter=new" },
}

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const imageVariants = {
    enter: { opacity: 0, scale: 1.05 },
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.32, 0.72, 0, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image carousel — only images animate */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[current].id}
          variants={imageVariants as any}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Static content overlay — never animates */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="max-w-2xl">

          <span className="inline-block bg-primary px-4 py-2 rounded label-md text-primary-foreground mb-6">
            {staticContent.badge}
          </span>

          <h1 className="display-lg text-white leading-tight">
            <span className="block">{staticContent.headline1}</span>
            <span className="block">{staticContent.headline2}</span>
          </h1>

          <p className="mt-6 body-lg text-white/80 max-w-lg text-pretty">
            {staticContent.body}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={staticContent.ctaPrimary.href}
              className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 label-md text-primary-foreground rounded-md transition-all hover:bg-primary-hover hover:gap-3"
            >
              {staticContent.ctaPrimary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={staticContent.ctaSecondary.href}
              className="inline-flex items-center justify-center border-2 border-white/40 px-8 py-4 label-md text-white rounded-md transition-all hover:bg-white/10 hover:border-white"
            >
              {staticContent.ctaSecondary.label}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt={`Customer ${i}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="title-md text-white">10,000+ Happy Customers</p>
              <p className="body-sm text-white/60">Join the movement</p>
            </div>
          </div>

        </div>
      </div>

      {/* Dot indicators only — no arrows */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 z-20">
        <span className="label-md text-white/50">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

    </section>
  )
}
