'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { TableRow } from '@/components/ui/table'

export const MotionCard = motion.create(Card)
export const MotionTableRow = motion.create(TableRow)

// Fade-and-rise enter props for list rows/cards, staggered by index.
// Total stagger is capped at ~350ms so long lists never feel slow.
// Pass the result of useReducedMotion() as `reduced` to snap instead of animate.
export function staggerIn(index: number, reduced: boolean | null, step = 0.04) {
  if (reduced) return {}
  return {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
      delay: Math.min(index * step, 0.35),
    },
  }
}
