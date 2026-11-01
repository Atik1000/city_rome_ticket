'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  eyebrow?: string
  actions?: React.ReactNode
  backHref?: string
  className?: string
}

/**
 * Unified page header: gold eyebrow, Fraunces display title, muted
 * description, right-aligned actions, closed by a gold hairline.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  backHref,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {backHref && (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="mt-1 shrink-0 cursor-pointer border-border/80 bg-card"
            >
              <Link href={backHref} aria-label="Go back">
                <ChevronLeft size={20} />
              </Link>
            </Button>
          )}
          <div className="min-w-0 space-y-1">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        )}
      </div>
      <div className="gold-hairline" aria-hidden="true" />
    </div>
  )
}
