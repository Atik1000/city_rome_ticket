'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export type StatusTone =
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'gold'
  | 'terracotta'
  | 'neutral'

const TONE_CLASSES: Record<StatusTone, { pill: string; dot: string }> = {
  success: {
    pill: 'bg-success-soft text-success border-success/25',
    dot: 'bg-success',
  },
  warning: {
    pill: 'bg-warning-soft text-warning border-warning/25',
    dot: 'bg-warning',
  },
  info: {
    pill: 'bg-info-soft text-info border-info/25',
    dot: 'bg-info',
  },
  danger: {
    pill: 'bg-destructive/10 text-destructive border-destructive/25',
    dot: 'bg-destructive',
  },
  gold: {
    pill: 'bg-gold-soft text-accent-foreground border-gold/35',
    dot: 'bg-gold',
  },
  terracotta: {
    pill: 'bg-primary/10 text-primary border-primary/25',
    dot: 'bg-primary',
  },
  neutral: {
    pill: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground/60',
  },
}

export function statusTone(status: string): StatusTone {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'confirmed':
    case 'accepted':
    case 'resolved':
    case 'active':
      return 'success'
    case 'pending':
    case 'in_review':
    case 'in-progress':
      return 'warning'
    case 'open':
    case 'new':
      return 'info'
    case 'cancelled':
    case 'rejected':
      return 'danger'
    case 'admin':
    case 'super_admin':
      return 'terracotta'
    case 'moderator':
    case 'manager':
      return 'gold'
    default:
      return 'neutral'
  }
}

interface StatusBadgeProps extends React.ComponentProps<'span'> {
  status: string
  /** Override the automatic tone mapping. */
  tone?: StatusTone
  /** Override the rendered label (defaults to prettified status). */
  label?: string
}

/**
 * Semantic status pill with a leading dot, mapped to the warm palette.
 */
export function StatusBadge({ status, tone, label, className, ...props }: StatusBadgeProps) {
  const resolved = tone ?? statusTone(status)
  const classes = TONE_CLASSES[resolved]
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        classes.pill,
        className,
      )}
      {...props}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', classes.dot)} aria-hidden="true" />
      {label ?? status.replace(/_/g, ' ')}
    </span>
  )
}
