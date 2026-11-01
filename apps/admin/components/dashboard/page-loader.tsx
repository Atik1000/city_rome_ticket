'use client'

import { Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLoaderProps {
  label?: string
  className?: string
}

/**
 * Branded loading state: gold track, terracotta sweep, landmark mark.
 */
export function PageLoader({ label = 'Loading', className }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex min-h-[50vh] flex-col items-center justify-center gap-4', className)}
    >
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-gold/25" aria-hidden="true" />
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary"
          aria-hidden="true"
        />
        <Landmark size={20} className="text-primary" aria-hidden="true" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
