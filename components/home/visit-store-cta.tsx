"use client"

import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"

export function VisitStoreCta() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link 
        href="https://maps.app.goo.gl/zzp5At3RJQg686Gr5"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl md:rounded-3xl shadow-lg ring-1 ring-black/5"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: "url('/images/brand-story.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center text-white">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
            <MapPin className="h-6 w-6" />
          </div>
          
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Visit Our Store
          </h2>
          
          <p className="mb-8 max-w-xl text-lg text-white/90 sm:text-xl">
            Experience our premium collection in person at Shubh Affinity, Swami Vivekananda Nagar, Kota.
          </p>

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 group-hover:-translate-y-1">
            Get Directions <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </section>
  )
}
