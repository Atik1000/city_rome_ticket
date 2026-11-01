"use client"

import { useRef } from "react"
import AmbientParticles from "@/components/animation/ambient-particles"
import { Reveal } from "@/components/animation/reveal"
import { gsap, useGSAP, prefersReducedMotion } from "@/components/animation/gsap"

export default function VideoBackgroundPage() {
  const sectionRef = useRef<HTMLElement>(null)

  // Gentle scrub parallax on the background video while the section crosses the viewport
  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return
      const media = sectionRef.current.querySelector("[data-parallax-media]")
      if (!media) return
      gsap.fromTo(
        media,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <main ref={sectionRef} className="relative w-full min-h-[70vh] overflow-hidden">
      {/* Video background (slightly oversized so the parallax never shows edges) */}
      <video
        data-parallax-media
        className="absolute inset-0 w-full h-full object-cover brightness-50 scale-[1.16] will-change-transform"
        src="/s_tour.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Lighter ember layer */}
      <AmbientParticles count={110} />

      {/* Content */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center gap-4">
        <Reveal className="flex flex-col items-center gap-4">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.4em] text-gold-light">
            Iconic Rome Tickets
          </p>
          <h2 className="font-serif text-white text-4xl sm:text-6xl md:text-7xl font-semibold text-balance">
            Book the Past,
            <br />
            Experience the Eternal.
          </h2>
          <div className="mt-4 h-px w-24 bg-gold/70" />
          <p className="text-white/85 text-base sm:text-lg max-w-xl">
            Two thousand years of history, one unforgettable visit.
          </p>
        </Reveal>
      </div>
    </main>
  )
}
