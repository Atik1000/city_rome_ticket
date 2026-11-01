"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"

/** Makes every framer-motion animation respect the OS prefers-reduced-motion setting. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
