"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

// Keeps three.js out of the main bundle; only loads where particles render.
const ParticleField = dynamic(() => import("./particle-field"), { ssr: false })

/**
 * Decorative WebGL dust/ember layer. Renders nothing (the static imagery +
 * gradient underneath act as the fallback) for reduced motion or missing WebGL,
 * and pauses the render loop while offscreen.
 */
export default function AmbientParticles({
  count = 220,
  className = "",
}: {
  count?: number
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const holderRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      setHasWebGL(!!(canvas.getContext("webgl2") || canvas.getContext("webgl")))
    } catch {
      setHasWebGL(false)
    }
  }, [])

  useEffect(() => {
    const el = holderRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasWebGL])

  if (shouldReduceMotion || hasWebGL === false) return null

  return (
    <div
      ref={holderRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {hasWebGL && <ParticleField count={count} active={inView} />}
    </div>
  )
}
