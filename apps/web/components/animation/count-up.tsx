"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "./gsap"

const format = (n: number, decimals: number) =>
  decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US")

/** Counts up from 0 when scrolled into view (once). Renders the final value for reduced motion. */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const counter = { n: 0 }
      el.textContent = format(0, decimals)
      gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(counter.n, decimals)
        },
      })
    },
    { dependencies: [value, decimals] },
  )

  return (
    <span className={className}>
      <span ref={ref}>{format(value, decimals)}</span>
      {suffix}
    </span>
  )
}
