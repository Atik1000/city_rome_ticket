'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Plus, AlertCircle, Search, RotateCcw, RefreshCcw } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { MotionTableRow, staggerIn } from '@/components/motion'
import { StatusModal } from '@/components/dashboard/status-modal'
import { BookingFormModal } from '@/components/dashboard/booking-form-modal'
import { PageHeader } from '@/components/dashboard/page-header'
import { PageLoader } from '@/components/dashboard/page-loader'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getBookings, Booking } from '@/app/lib/api'
import { useAuth } from '@/app/contexts/auth-context'
import { Input } from '@/components/ui/input'

const ITEMS_PER_PAGE = 20

export default function BookingsPage() {
  const { token } = useAuth()
  const reduceMotion = useReducedMotion()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [activeDateFrom, setActiveDateFrom] = useState('')
  const [activeDateTo, setActiveDateTo] = useState('')

  const fetchBookings = async (page: number, searchTerm: string = '', from?: string, to?: string) => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getBookings(token, page, searchTerm, from, to)
      setBookings(response.results)
      setTotalCount(response.count)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(currentPage, search, activeDateFrom, activeDateTo)
  }, [token, currentPage, search, activeDateFrom, activeDateTo])

  const handleDateSearch = () => {
    setCurrentPage(1)
    setSearch('')
    setSearchValue('')
    setActiveDateFrom(dateFrom)
    setActiveDateTo(dateTo)
  }

  const handleTextSearch = () => {
    setCurrentPage(1)
    setSearch(searchValue)
    setDateFrom('')
    setDateTo('')
    setActiveDateFrom('')
    setActiveDateTo('')
  }

  const handleReset = () => {
    setCurrentPage(1)
    setSearchValue('')
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setActiveDateFrom('')
    setActiveDateTo('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSearch()
    }
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId)

  const handleStatusChange = () => {
    fetchBookings(currentPage, search, activeDateFrom, activeDateTo)
  }

  if (loading) {
    return <PageLoader label="Loading bookings" className="min-h-screen" />
  }

  if (error && bookings.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium text-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Reservations"
        title="Bookings"
        description="Manage tour bookings and reservations"
        actions={
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base px-4 py-2 h-10 sm:h-11 rounded-lg shadow-lg shadow-primary/15"
          >
            <Plus size={20} />
            Add New Booking
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <Card className="p-3 sm:p-4 gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-10 border-border bg-background/60"
              aria-label="Search bookings"
            />
          </div>
          <Button
            onClick={handleTextSearch}
            className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Search
          </Button>

          <div
            className="mx-1 hidden h-6 w-px bg-border sm:block"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10 border-border bg-background/60 w-full sm:w-40"
              aria-label="From date"
              title="From Date"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10 border-border bg-background/60 w-full sm:w-40"
              aria-label="To date"
              title="To Date"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleDateSearch}
            className="h-10 px-4 border-border cursor-pointer"
          >
            Filter by Date
          </Button>

          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-10 px-3 text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </Card>

      {/* Bookings Table - Responsive */}
      <Card className="border-border/80 overflow-hidden shadow-warm p-0 gap-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="pl-5">ID</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      title="No bookings found"
                      description="Adjust the filters or add a new booking to get started."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking, i) => (
                  <MotionTableRow
                    key={`${currentPage}-${booking.id}`}
                    className="border-border/70 hover:bg-accent/35 transition-colors"
                    {...staggerIn(i, reduceMotion, 0.03)}
                  >
                    <TableCell className="pl-5 font-semibold text-foreground text-xs sm:text-sm">#{booking.id}</TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm capitalize">{booking.user_type}</TableCell>
                    <TableCell className="text-foreground text-xs sm:text-sm font-semibold tabular-nums">
                      €{parseFloat(booking.total_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">
                      {new Date(booking.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex justify-end gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              asChild
                              variant="outline"
                              size="icon-sm"
                              className="border-border text-muted-foreground hover:text-primary hover:bg-primary/10 bg-transparent rounded-lg cursor-pointer"
                            >
                              <Link href={`/dashboard/bookings/${booking.id}`} aria-label={`View booking #${booking.id}`}>
                                <Eye size={15} />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View booking</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="border-border text-muted-foreground hover:text-primary hover:bg-primary/10 bg-transparent rounded-lg cursor-pointer"
                              aria-label={`Update status of booking #${booking.id}`}
                              onClick={() => {
                                setSelectedBookingId(booking.id)
                                setStatusModalOpen(true)
                              }}
                            >
                              <RefreshCcw size={15} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Update status</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </MotionTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 px-2">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Page {currentPage} of {totalPages} ({totalCount} total bookings)
          </div>
          <div className="flex items-center gap-2 overflow-x-auto order-1 sm:order-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="border-border text-sm h-10 px-4 flex-shrink-0"
            >
              Previous
            </Button>

            <div className="flex gap-1 flex-shrink-0">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`cursor-pointer text-sm h-10 w-10 p-0 rounded-lg ${currentPage === i + 1
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                    : 'border-border hover:bg-secondary'
                    }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="border-border text-sm h-10 px-4 flex-shrink-0"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      <BookingFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSaved={() => fetchBookings(currentPage, search, activeDateFrom, activeDateTo)}
      />

      {/* Status Modal */}
      {selectedBooking && token && (
        <StatusModal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false)
            setSelectedBookingId(null)
          }}
          onSave={handleStatusChange}
          currentStatus={selectedBooking.status}
          id={selectedBooking.id}
          token={token}
        />
      )}
    </div>
  )
}
