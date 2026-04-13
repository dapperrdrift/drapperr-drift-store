"use client"

import dynamic from "next/dynamic"

const AnimatedTestimonials = dynamic(
  () =>
    import("@/components/ui/animated-testimonials").then(
      (mod) => mod.AnimatedTestimonials
    ),
  { ssr: false }
)

const testimonials = [
  {
    quote:
      "Drapperr Drift has completely transformed my wardrobe. The quality is unmatched and every piece feels like it was made just for me. I get compliments everywhere I go!",
    name: "Priya Sharma",
    designation: "Fashion Blogger, Mumbai",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "Finally, a brand that understands modern fashion without compromising on comfort. The fabrics are luxurious and the designs are effortlessly stylish.",
    name: "Arjun Mehta",
    designation: "Creative Director, Delhi",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "I've been shopping with Drapperr Drift for over a year now. Their attention to detail and customer service is exceptional. Truly a premium experience.",
    name: "Ananya Patel",
    designation: "Entrepreneur, Bangalore",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "The sustainable approach combined with cutting-edge design makes Drapperr Drift my go-to for all occasions. From casual to formal, they've got it all.",
    name: "Vikram Singh",
    designation: "Tech Executive, Hyderabad",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <span className="label-md text-primary">What Our Customers Say</span>
          <h2 className="mt-4 display-md text-foreground">
            Loved by Fashion Enthusiasts
          </h2>
          <p className="mt-4 body-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their style with Drapperr Drift
          </p>
        </div>
        <AnimatedTestimonials testimonials={testimonials} autoplay />
      </div>
    </section>
  )
}
