"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "./gsap"

/** Scroll-triggered fade + rise for a single block. Fires once. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.from(ref.current, {
        y,
        autoAlpha: 0,
        duration: 0.6,
        delay,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/**
 * Staggers the direct children in with y + fade when the container scrolls into view.
 * Pass `watch` (e.g. an item count) so children that arrive async still animate;
 * already-revealed children are skipped on re-runs.
 */
export function StaggerReveal({
  children,
  className,
  watch,
  stagger = 0.08,
  y = 28,
}: {
  children: ReactNode
  className?: string
  watch?: unknown
  stagger?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      const items = Array.from(ref.current.children).filter(
        (el) => !el.hasAttribute("data-revealed"),
      )
      if (items.length === 0) return
      items.forEach((el) => el.setAttribute("data-revealed", "1"))
      gsap.from(items, {
        y,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      })
    },
    { scope: ref, dependencies: [watch] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
