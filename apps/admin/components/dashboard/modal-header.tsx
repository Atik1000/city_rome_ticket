'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type Tone = 'default' | 'destructive' | 'success'

const MEDALLION: Record<Tone, string> = {
  default: 'bg-primary/10 text-primary ring-gold/40',
  destructive: 'bg-destructive/10 text-destructive ring-destructive/25',
  success: 'bg-success-soft text-success ring-success/30',
}

function Medallion({ icon: Icon, tone }: { icon: LucideIcon; tone: Tone }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl ring-1',
        MEDALLION[tone],
      )}
    >
      <Icon size={20} />
    </div>
  )
}

interface ModalHeaderProps {
  icon: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  tone?: Tone
  className?: string
}

/**
 * Unified dialog header: icon medallion + Fraunces title + description.
 * Use inside <DialogContent>.
 */
export function ModalHeader({
  icon,
  title,
  description,
  tone = 'default',
  className,
}: ModalHeaderProps) {
  return (
    <DialogHeader className={className}>
      <div className="flex items-start gap-3.5 text-left">
        <Medallion icon={icon} tone={tone} />
        <div className="min-w-0 space-y-1 pt-0.5">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
      </div>
    </DialogHeader>
  )
}

/**
 * Same pattern for <AlertDialogContent>.
 */
export function AlertModalHeader({
  icon,
  title,
  description,
  tone = 'default',
  className,
}: ModalHeaderProps) {
  return (
    <AlertDialogHeader className={className}>
      <div className="flex items-start gap-3.5 text-left">
        <Medallion icon={icon} tone={tone} />
        <div className="min-w-0 space-y-1 pt-0.5">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="whitespace-pre-line">
              {description}
            </AlertDialogDescription>
          )}
        </div>
      </div>
    </AlertDialogHeader>
  )
}

/**
 * Gold hairline section divider with an optional small-caps label,
 * for separating form sections inside dialogs.
 */
export function ModalSectionDivider({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  if (!label) {
    return <div className={cn('gold-hairline', className)} aria-hidden="true" />
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        {label}
      </span>
      <div className="gold-hairline flex-1" aria-hidden="true" />
    </div>
  )
}
