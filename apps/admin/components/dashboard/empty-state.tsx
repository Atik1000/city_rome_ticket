'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/** Simple laurel-branch motif, drawn inline so it inherits the gold tone. */
export function LaurelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-12 w-24 text-gold', className)}
    >
      {/* Left branch */}
      <path
        d="M44 42 C28 40 14 30 10 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {[
        [13, 17, -55],
        [17, 24, -40],
        [23, 30, -28],
        [30, 35, -16],
        [38, 39, -6],
      ].map(([x, y, r], i) => (
        <ellipse
          key={`l${i}`}
          cx={x}
          cy={y}
          rx="2.6"
          ry="6"
          transform={`rotate(${r} ${x} ${y})`}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
      {/* Right branch */}
      <path
        d="M52 42 C68 40 82 30 86 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {[
        [83, 17, 55],
        [79, 24, 40],
        [73, 30, 28],
        [66, 35, 16],
        [58, 39, 6],
      ].map(([x, y, r], i) => (
        <ellipse
          key={`r${i}`}
          cx={x}
          cy={y}
          rx="2.6"
          ry="6"
          transform={`rotate(${r} ${x} ${y})`}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
      {/* Centre dot */}
      <circle cx="48" cy="40" r="1.6" fill="currentColor" />
    </svg>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Branded empty state: laurel motif, Fraunces title, one line of copy,
 * and the next action.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-14 text-center',
        className,
      )}
    >
      <LaurelMark />
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
