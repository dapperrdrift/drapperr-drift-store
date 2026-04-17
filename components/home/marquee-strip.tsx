const items = [
  "FREE SHIPPING ₹5,000+",
  "SHIPS IN 48 HOURS",
  "COD AVAILABLE",
  "MADE IN INDIA",
  "KOTA ORIGINAL",
  "100% ORIGINAL DESIGNS",
  "30-DAY RETURNS",
]

export function MarqueeStrip() {
  const loop = [...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-border bg-background py-4">
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-12 text-sm font-black uppercase tracking-[0.22em] text-foreground"
          >
            {item}
            <span aria-hidden className="text-primary">★</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes dd-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .marquee-track {
          animation: dd-marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
