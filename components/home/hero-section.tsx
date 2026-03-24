"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

const slides = [
  {
    id: 1,
    image: "/images/hero-funky.jpg",
    badge: "New Season Drop",
    headline1: "Bold Moves.",
    headline2: "Bolder Style.",
    body: "Fashion isn't just what you wear — it's how you own the room. Discover pieces that speak before you do.",
    ctaPrimary: { label: "Explore Collection", href: "/products" },
    ctaSecondary: { label: "New Arrivals", href: "/products?filter=new" },
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
    badge: "Exclusive Drop",
    headline1: "Wear Your",
    headline2: "Rebellion.",
    body: "Rules were made to be broken. Dress like you mean it. Every stitch is a statement, every look a manifesto.",
    ctaPrimary: { label: "Shop Women", href: "/products?category=women" },
    ctaSecondary: { label: "View Lookbook", href: "/products" },
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
    badge: "The Squad Fit",
    headline1: "Stand Out.",
    headline2: "Stand Together.",
    body: "Clothes that vibe with your crew. Built for those who move loud, live louder, and style loudest.",
    ctaPrimary: { label: "Shop the Look", href: "/products" },
    ctaSecondary: { label: "Collections", href: "/products?filter=collections" },
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1)
  }, [current, goTo])

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
    }),
  }

  const contentVariants = {
    enter: { opacity: 0, y: 30 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={`${slide.headline1} ${slide.headline2}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="inline-block bg-primary px-4 py-2 rounded label-md text-primary-foreground mb-6">
                {slide.badge}
              </span>

              <h1 className="display-lg text-white leading-tight">
                <span className="block">{slide.headline1}</span>
                <span className="block">{slide.headline2}</span>
              </h1>

              <p className="mt-6 body-lg text-white/80 max-w-lg text-pretty">
                {slide.body}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={slide.ctaPrimary.href}
                  className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 label-md text-primary-foreground rounded-md transition-all hover:bg-primary-hover hover:gap-3"
                >
                  {slide.ctaPrimary.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={slide.ctaSecondary.href}
                  className="inline-flex items-center justify-center border-2 border-white/40 px-8 py-4 label-md text-white rounded-md transition-all hover:bg-white/10 hover:border-white"
                >
                  {slide.ctaSecondary.label}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/30 border border-white/20 text-white backdrop-blur-sm transition-all hover:bg-primary hover:border-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/30 border border-white/20 text-white backdrop-blur-sm transition-all hover:bg-primary hover:border-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
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
