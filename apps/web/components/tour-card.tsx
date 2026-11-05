"use client"

import { TourPlan } from "@/services/tourService"
import { Clock, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TourCard({ tour }: { tour: TourPlan }) {
  const imageUrl =
    tour.images && tour.images.length > 0
      ? tour.images[0].file
      : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"

  return (
    <Link href={`/tour/${tour.id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group bg-card rounded-2xl overflow-hidden border border-gold/20 shadow-warm hover:shadow-warm-lg hover:border-gold/40 transition-[box-shadow,border-color] duration-300 cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 via-40% to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {tour.skip_the_line && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                <Zap size={12} className="text-gold" />
                Skip the line
              </span>
            )}
          </div>

          {tour.duration_days != null && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-espresso/70 border border-white/20 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white">
              <Clock size={12} className="text-gold-light" />
              {tour.duration_days === 1 ? "Day trip" : `${tour.duration_days} days`}
            </span>
          )}

        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-serif font-semibold text-base sm:text-lg leading-snug text-ink mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {tour.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tour.description}</p>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-dashed border-gold/30 flex items-center justify-between gap-2">
            {/* Gilded price tag */}
            <span className="inline-flex items-baseline gap-1.5 rounded-lg bg-espresso border border-gold/50 px-2.5 py-1.5 shadow-warm transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className="text-[10px] uppercase tracking-[0.12em] text-gold-light/80">From</span>
              <span className="font-serif text-lg leading-none font-semibold text-gold-light">€{tour.price_adult}</span>
              <span className="text-[10px] text-gold-light/70">/ person</span>
            </span>
            <span className="text-xs font-medium text-gold group-hover:text-brand transition-colors whitespace-nowrap">
              View tour →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
