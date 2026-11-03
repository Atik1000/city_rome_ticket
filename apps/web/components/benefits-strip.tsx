"use client"

import { StaggerReveal } from "@/components/animation/reveal"
import { CountUp } from "@/components/animation/count-up"

const stats = [
  { value: 10, suffix: "+", label: "Years guiding Rome" },
  { value: 50, suffix: "k+", label: "Happy travelers" },
  { value: 120, suffix: "+", label: "Tours every month" },
  { value: 4.8, suffix: "/5", decimals: 1, label: "Average rating" },
]

export default function BenefitsStrip() {
  return (
    <section className="w-full bg-cream/60 border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <StaggerReveal
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
          y={16}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl sm:text-4xl font-semibold text-brand">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
