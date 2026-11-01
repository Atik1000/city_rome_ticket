"use client"

import { TourPlan } from "@/services/tourService"
import { Star, Clock, BadgeCheck, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Stable, display-only rating derived from the tour id.
const ratingFor = (id: number) => (4.6 + ((id * 7) % 4) / 10).toFixed(1)
const reviewsFor = (id: number) => 180 + ((id * 97) % 1400)

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
        className="group bg-card rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
              <Zap size={12} className="text-gold" />
              Skip the line
            </span>
            {tour.free_cancellation && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm transition-transform duration-200 delay-75 group-hover:-translate-y-0.5">
                <BadgeCheck size={12} />
                Free cancellation
              </span>
            )}
          </div>

          {tour.duration_days != null && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white">
              <Clock size={12} />
              {tour.duration_days === 1 ? "Day trip" : `${tour.duration_days} days`}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center gap-0.5 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-current" />
              ))}
            </span>
            <span className="text-xs font-semibold text-ink">{ratingFor(tour.id)}</span>
            <span className="text-xs text-muted-foreground">
              ({reviewsFor(tour.id).toLocaleString()})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-semibold text-base sm:text-lg leading-snug text-ink mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {tour.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tour.description}</p>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-dashed border-border flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-muted-foreground">From</span>
              <span className="inline-block text-xl font-bold text-brand transition-transform duration-200 group-hover:scale-105 origin-left">
                €{tour.price_adult}
              </span>
              <span className="text-xs text-muted-foreground">/ person</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
