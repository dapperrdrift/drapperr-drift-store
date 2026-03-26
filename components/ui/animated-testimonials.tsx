"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// Static tilt values per slot — never computed at runtime, so SSR & client always agree
const SLOT_TILTS = [-8, 5, -3, 7, -6, 4, -9, 2];

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () =>
    setActive((prev) => (prev + 1) % testimonials.length);

  const handlePrev = () =>
    setActive(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* Image stack */}
        <div className="relative z-0 overflow-hidden">
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const tilt = isActive(index)
                  ? 0
                  : SLOT_TILTS[index % SLOT_TILTS.length];

                return (
                  <motion.div
                    key={testimonial.src}
                    // rotate is intentionally absent from all motion props
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      zIndex: isActive(index)
                        ? 10
                        : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -30, 0] : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    // Tilt applied via static CSS — never touched by Framer Motion
                    style={{ transform: `rotate(${tilt}deg)` }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-muted-foreground">
              {testimonials[active].quote.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * i,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
