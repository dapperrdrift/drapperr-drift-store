"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useAuth } from "@/contexts/auth-context"

export function CTASection() {
  const { user } = useAuth()
  const secondaryCta = user
    ? { href: "/account", label: "My Account" }
    : { href: "/signup", label: "Create Account" }

  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-125 h-125 rounded-full bg-white/5"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full border border-white/10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 label-md mb-6">
            <Sparkles className="h-4 w-4" />
            Limited Time Offer
          </span>
        </motion.div>

        <motion.h2
          className="display-lg text-white text-balance"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Get 20% Off Your First Order
        </motion.h2>

        <motion.p
          className="mt-6 body-lg text-white/80 max-w-2xl mx-auto text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join the Drapperr Drift community today and unlock exclusive access to new collections, 
          special discounts, and style inspiration delivered straight to your inbox.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 label-md rounded-md transition-all hover:bg-white/90 hover:gap-3"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 label-md rounded-md transition-all hover:bg-white/10 hover:border-white/50"
          >
            {secondaryCta.label}
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 body-sm text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Use code WELCOME20 at checkout. Valid for new customers only.
        </motion.p>
      </div>
    </section>
  )
}
