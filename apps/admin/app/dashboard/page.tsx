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
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  chipClass: string
  sub?: React.ReactNode
  loading?: boolean
}

function StatCard({ title, value, icon, chipClass, sub, loading }: StatCardProps) {
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
    <Card className="p-5 gap-0 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${chipClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {title}
      </p>
      <p className="text-3xl font-black text-foreground tabular-nums tracking-tight">{value}</p>
      {sub && <div className="mt-3">{sub}</div>}
    </Card>
  )
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'open':
    case 'confirmed':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'in_review':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function DashboardPage() {
  const { token, user } = useAuth()
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {user?.first_name ? `Welcome back, ${user.first_name}` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Here's what's happening with Iconic Rome Tickets today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats?.total_bookings ?? 0}
          icon={<CalendarCheck size={22} className="text-primary" />}
          chipClass="bg-primary/10"
          loading={loading}
        />
        <StatCard
          title="Completed"
          value={stats?.completed_bookings ?? 0}
          icon={<CheckCircle2 size={22} className="text-green-700" />}
          chipClass="bg-green-100"
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
        />
        <StatCard
          title="Total Income"
          value={`€${(stats?.total_income || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<Euro size={22} className="text-gold" />}
          chipClass="bg-gold/15"
          loading={loading}
        />
        <StatCard
          title="Client Requests"
          value={stats?.total_client_request ?? 0}
          icon={<MessageSquare size={22} className="text-blue-700" />}
          chipClass="bg-blue-100"
          loading={loading}
        />
      </div>

      {/* Recent Bookings */}
      <Card className="p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Bookings</h2>
            <p className="text-xs text-muted-foreground">The latest reservations across all tours</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
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
          <div className="p-10 text-center text-sm text-muted-foreground">
            No bookings yet. Create your first one from the Bookings page.
          </div>
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
              {recentBookings.map((booking) => (
                <TableRow key={booking.id} className="border-border hover:bg-secondary/40 transition-colors">
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
                    <Badge
                      className={`${getStatusColor(booking.status)} capitalize font-normal border-none shadow-none`}
                    >
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground whitespace-nowrap">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
