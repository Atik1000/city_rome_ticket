'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarCheck,
  CheckCircle2,
  Euro,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react'
import { animate, useReducedMotion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MotionCard, MotionTableRow, staggerIn } from '@/components/motion'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDashboardStats, getBookings, DashboardStats, Booking } from '@/app/lib/api'
import { useAuth } from '@/app/contexts/auth-context'

function CountUp({ value, format }: { value: number; format?: (v: number) => string }) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(() => (reduceMotion ? value : 0))

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [value, reduceMotion])

  return <>{format ? format(display) : Math.round(display).toLocaleString()}</>
}

interface StatCardProps {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  chipClass: string
  sub?: React.ReactNode
  loading?: boolean
  index?: number
}

function StatCard({ title, value, icon, chipClass, sub, loading, index = 0 }: StatCardProps) {
  const reduceMotion = useReducedMotion()

  if (loading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-muted" />
        </div>
        <div className="h-3 bg-muted rounded w-24 mb-3" />
        <div className="h-8 bg-muted rounded w-20" />
      </Card>
    )
  }

  return (
    <MotionCard
      className="p-5 gap-0 bg-warm-wash hover:shadow-warm transition-shadow"
      {...staggerIn(index, reduceMotion, 0.08)}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ring-gold/30 shadow-warm-sm ${chipClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
        {title}
      </p>
      <p className="font-display text-3xl font-semibold text-foreground tabular-nums tracking-tight">
        {value}
      </p>
      <div className="gold-hairline mt-4" aria-hidden="true" />
      {sub && <div className="mt-3">{sub}</div>}
    </MotionCard>
  )
}

export default function DashboardPage() {
  const { token, user } = useAuth()
  const reduceMotion = useReducedMotion()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        setLoading(true)
        const [statsData, bookingsData] = await Promise.all([
          getDashboardStats(token),
          getBookings(token, 1),
        ])
        setStats(statsData)
        setRecentBookings(bookingsData.results.slice(0, 6))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const completionRate = parseFloat(stats?.completion_rate || '0')

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Overview"
        title={user?.first_name ? `Welcome back, ${user.first_name}` : 'Dashboard'}
        description="Here's what's happening with Iconic Rome Tickets today."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={<CountUp value={stats?.total_bookings ?? 0} />}
          icon={<CalendarCheck size={22} className="text-primary" />}
          chipClass="bg-primary/10"
          loading={loading}
          index={0}
        />
        <StatCard
          title="Completed"
          value={<CountUp value={stats?.completed_bookings ?? 0} />}
          icon={<CheckCircle2 size={22} className="text-success" />}
          chipClass="bg-success-soft"
          sub={
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Completion rate</span>
                <span className="font-bold text-foreground">{stats?.completion_rate || '0%'}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="bg-gold h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, completionRate)}%` }}
                />
              </div>
            </div>
          }
          loading={loading}
          index={1}
        />
        <StatCard
          title="Total Income"
          value={
            <CountUp
              value={stats?.total_income || 0}
              format={(v) =>
                `€${v.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
          }
          icon={<Euro size={22} className="text-gold" />}
          chipClass="bg-gold/15"
          loading={loading}
          index={2}
        />
        <StatCard
          title="Client Requests"
          value={<CountUp value={stats?.total_client_request ?? 0} />}
          icon={<MessageSquare size={22} className="text-info" />}
          chipClass="bg-info-soft"
          loading={loading}
          index={3}
        />
      </div>

      {/* Recent Bookings */}
      <Card className="p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-warm-wash">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Recent Bookings
            </h2>
            <p className="text-xs text-muted-foreground">The latest reservations across all tours</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="Create your first one from the Bookings page."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/40">
                <TableHead className="pl-5">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking, i) => (
                <MotionTableRow
                  key={booking.id}
                  className="border-border/70 hover:bg-accent/35 transition-colors"
                  {...staggerIn(i, reduceMotion)}
                >
                  <TableCell className="pl-5 font-semibold text-foreground">
                    <Link href={`/dashboard/bookings/${booking.id}`} className="hover:text-primary">
                      #{booking.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {(booking as any).full_name || (booking as any).email || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">{booking.user_type}</TableCell>
                  <TableCell className="font-semibold tabular-nums">
                    €{parseFloat(booking.total_price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground whitespace-nowrap">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                </MotionTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
