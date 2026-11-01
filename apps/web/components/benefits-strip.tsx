"use client"

import { Zap, CalendarCheck, Users, Smartphone } from "lucide-react"
import { StaggerReveal } from "@/components/animation/reveal"
import { CountUp } from "@/components/animation/count-up"

const benefits = [
  {
    icon: Zap,
    title: "Skip the line",
    text: "Walk straight past the queues at Rome's busiest sights.",
  },
  {
    icon: CalendarCheck,
    title: "Free cancellation",
    text: "Plans change — cancel up to 24h before on most tours.",
  },
  {
    icon: Users,
    title: "Local expert guides",
    text: "Licensed Roman guides who bring 2,000 years of history to life.",
  },
  {
    icon: Smartphone,
    title: "Instant tickets",
    text: "Mobile tickets delivered the moment you book.",
  },
]

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
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" y={20}>
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-gold/25 shadow-warm">
                <b.icon size={22} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </StaggerReveal>

        {/* Stats */}
        <div aria-hidden="true" className="gold-rule mt-8" />
        <StaggerReveal
          className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
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
