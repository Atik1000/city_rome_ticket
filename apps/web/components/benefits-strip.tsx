"use client"

import { Zap, CalendarCheck, Users, Smartphone } from "lucide-react"

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

export default function BenefitsStrip() {
  return (
    <section className="w-full bg-cream/60 border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <b.icon size={22} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
