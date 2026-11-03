'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Clock, Loader2, AlertCircle, CheckCircle2, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { PageLoader } from '@/components/dashboard/page-loader'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { AlertModalHeader } from '@/components/dashboard/modal-header'
import { getTourPlanDetail, deleteTourPlan, TourPlan } from '@/app/lib/api'
import { getCookie } from '@/app/lib/cookies'
import { LocationModal } from '@/components/dashboard/location-modal'
import { DateModal } from '@/components/dashboard/date-modal'
import { TourFormModal } from '@/components/dashboard/tour-form-modal'
import { fetchTourDates } from '@/app/lib/redux/tour-date-slice'
import { RootState, AppDispatch } from '@/app/lib/redux/store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  } from "@/components/ui/alert-dialog"

const TimeSlotCount = ({ dateId }: { dateId: string }) => {
  const [count, setCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = getCookie('access_token')
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tour/plan/date/time/${dateId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await response.json()
          setCount(data.count || 0)
        }
      } catch (err) {
        console.error('Failed to fetch time count:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCount()
  }, [dateId])

  if (isLoading) return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />

  return (
    <span className="text-xs text-muted-foreground mt-1">
      {count} time slot{count !== 1 ? 's' : ''}
    </span>
  )
}

export default function TourDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const tourId = params.id as string
  const dispatch = useDispatch<AppDispatch>()
  const { dates: reduxDates, isLoading: isDatesLoading } = useSelector((state: RootState) => state.tourDate)

  const [tour, setTour] = useState<TourPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [locationMode, setLocationMode] = useState<'create' | 'edit'>('create')

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onConfirm?: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  })

  const fetchTourDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = getCookie('access_token')
      if (token && tourId) {
        const data = await getTourPlanDetail(token, tourId)
        setTour(data)
        // Also fetch dates via Redux
        dispatch(fetchTourDates(parseInt(tourId)))
      } else if (!token) {
        setError('Authentication token not found. Please log in again.')
      }
    } catch (err) {
      setError('Failed to fetch tour details. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [tourId, dispatch])

  useEffect(() => {
    fetchTourDetail()
  }, [fetchTourDetail])

  const handlePrevImage = () => {
    if (!tour?.images.length) return
    setCurrentImageIndex((prev) => (prev === 0 ? tour.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!tour?.images.length) return
    setCurrentImageIndex((prev) => (prev === tour.images.length - 1 ? 0 : prev + 1))
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const token = getCookie('access_token')
      if (!token) {
        throw new Error('Authentication token not found.')
      }

      await deleteTourPlan(token, tourId)

      setAlertConfig({
        show: true,
        title: 'Success',
        message: 'Tour deleted successfully.',
        type: 'success',
        onConfirm: () => router.push('/dashboard/tours')
      })
    } catch (err: any) {
      console.error('Delete tour error:', err)
      let errorMessage = 'Failed to delete tour. Please try again.'
      if (err) {
        const errorDetails = Object.entries(err).map(([key, value]) => {
          if (Array.isArray(value)) return `${key}: ${value.join(', ')}`
          return `${key}: ${value}`
        }).join('\n')
        errorMessage = errorDetails || errorMessage
      }

      setAlertConfig({
        show: true,
        title: 'Error',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return <PageLoader label="Loading tour" className="min-h-screen" />
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Card className="p-8 max-w-md border-border">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{error || "Tour not found"}</h2>
          <Link href="/dashboard/tours">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Tours
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Back Button & Header */}
      <PageHeader
        eyebrow="Tour Details"
        backHref="/dashboard/tours"
        title={tour.title}
        description={
          <span className="line-clamp-2 md:line-clamp-none">{tour.description}</span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Image Carousel */}
          <Card className="border-border/80 overflow-hidden shadow-warm p-0 gap-0">
            <div className="relative bg-secondary h-76 sm:h-100">
              <img
                src={tour.images[currentImageIndex]?.file || "/placeholder.svg"}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              {tour.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                {tour.images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                      }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Price & Duration Card */}
          <Card className="p-6 border-border/80 shadow-warm space-y-4 bg-warm-wash">
            <div>
              <p className="text-gold text-[11px] uppercase font-semibold tracking-[0.18em] mb-1">Starting From</p>
              <p className="font-display text-3xl font-semibold tracking-tight text-primary tabular-nums">${tour.price_adult}</p>
            </div>
            <div className="gold-hairline" aria-hidden="true" />
            {tour.duration_days && (
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground" size={20} />
                <span className="text-foreground font-medium">{tour.duration_days} Days</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={tour.status}
                tone={tour.is_active ? 'success' : 'neutral'}
              />
              {tour.skip_the_line && (
                <StatusBadge status="skip the line" tone="info" />
              )}
              {tour.free_cancellation && (
                <StatusBadge status="free cancellation" tone="success" />
              )}
              {tour.pickup_included && (
                <StatusBadge status="pickup included" tone="info" />
              )}
            </div>
          </Card>
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(true)}
              className="flex-1 border-border text-foreground hover:text-primary hover:bg-primary/10 bg-card h-10 cursor-pointer"
            >
              <Edit size={18} />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 border-destructive/25 text-destructive hover:text-destructive hover:bg-destructive/10 bg-card h-10 cursor-pointer"
            >
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        </div>

        {/* Right Column - Comprehensive Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <Card className="p-6 border-border/80 shadow-warm space-y-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Overview</h2>

            {tour.full_description && (
              <div className="prose prose-sm max-w-none text-muted-foreground wrap-break-word">
                <p className="whitespace-pre-line">{tour.full_description}</p>
              </div>
            )}

            {tour.highlights && tour.highlights.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  {tour.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Locations Section - RESTORED */}
          <Card className="p-6 border-border/80 shadow-warm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Locations</h2>
              {/* <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                onClick={() => {
                  setLocationMode('create')
                  setLocationModalOpen(true)
                }}
              >
                <Plus size={16} />
                Add New Location
              </Button> */}
            </div>

            {tour.locations.length > 0 ? (
              <div className="space-y-2 mb-4">
                {tour.locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start gap-3 bg-secondary/40 p-3 rounded-lg border border-border/70"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{location.name}</p>
                      {location.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {location.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No locations added yet
              </p>
            )}

            {/* <Button
              variant="outline"
              className="w-full border-border text-primary hover:bg-primary/10 bg-transparent"
              onClick={() => {
                setLocationMode('edit')
                setLocationModalOpen(true)
              }}
            >
              Edit Locations
            </Button> */}
          </Card>

          {/* Inclusions & Exclusions */}
          <Card className="p-6 border-border/80 shadow-warm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Includes</h3>
                {tour.includes.length > 0 ? (
                  <ul className="space-y-2">
                    {tour.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">None</p>
                )}
              </div>
              <div className="pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-border md:pl-8">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Excludes</h3>
                {tour.excludes.length > 0 ? (
                  <ul className="space-y-2">
                    {tour.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive flex-shrink-0">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">None</p>
                )}
              </div>
            </div>
          </Card>

          {/* Important Information */}
          <Card className="p-6 border-border/80 shadow-warm space-y-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Important Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-3">Know Before You Go</h3>
                  {tour.know_before_you_go.length > 0 ? (
                    <ul className="space-y-3">
                      {tour.know_before_you_go.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground pb-2 border-b border-border/50 last:border-0 flex items-start gap-2">
                          <span className="text-gold font-semibold flex-shrink-0 tabular-nums">{i + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No specific info</p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-3">Not Allowed</h3>
                  {tour.not_allowed.length > 0 ? (
                    <ul className="space-y-2">
                      {tour.not_allowed.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No restrictions</p>
                  )}
                </div>
                <div className="pt-6 border-t border-border">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-3">Not Suitable For</h3>
                  {tour.not_suitable_for.length > 0 ? (
                    <ul className="space-y-2">
                      {tour.not_suitable_for.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No specifics</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Dates & Tickets Section - RESTORED */}
          <Card className="p-6 border-border/80 shadow-warm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Date & Tickets</h2>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer border-border text-foreground hover:text-primary hover:bg-primary/10 bg-card flex items-center gap-2"
                onClick={() => setDateModalOpen(true)}
              >
                <Plus size={16} />
                Add New Date
              </Button>
            </div>

            {isDatesLoading && reduxDates.length === 0 ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : reduxDates.length > 0 ? (
              <div className="space-y-2 mb-4">
                {reduxDates.map((date: any) => (
                  <Link key={date.id} href={`/dashboard/tours/${tour.id}/dates/${date.id}`}>
                    <div className="group flex items-center justify-between gap-3 bg-secondary/40 p-3 rounded-lg border border-border/70 hover:border-gold/60 hover:bg-accent/35 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-gold/25">
                          <CalendarDays size={15} />
                        </span>
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {new Date(date.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TimeSlotCount dateId={date.id.toString()} />
                        <ChevronRight size={16} className="text-muted-foreground/60 group-hover:text-primary transition-colors" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No dates scheduled yet"
                description="Add a date to open this tour for bookings."
                className="py-8"
              />
            )}
          </Card>
        </div>
      </div>

      {/* Modals placeholders */}
      <TourFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        tour={tour}
        onSaved={fetchTourDetail}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSave={() => setLocationModalOpen(false)}
        initialLocations={tour.locations.map(loc => ({
          ...loc,
          id: loc.id.toString()
        }))}
        mode={locationMode}
      />

      <DateModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        onSave={() => {
          dispatch(fetchTourDates(parseInt(tourId)))
          setDateModalOpen(false)
        }}
        initialDates={reduxDates.map((d: any) => ({
          ...d,
          id: d.id.toString()
        }))}
        tourId={parseInt(tourId)}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md border-destructive/20">
          <AlertModalHeader
            icon={Trash2}
            tone="destructive"
            title={`Delete tour "${tour?.title}"?`}
            description="This action cannot be undone. The tour and all of its associated data, including dates and time slots, will be permanently deleted."
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer border-border bg-transparent hover:bg-secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white border-0"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Delete Tour'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Feedback Alert Dialog */}
      <AlertDialog
        open={alertConfig.show}
        onOpenChange={(v) => setAlertConfig({ ...alertConfig, show: v })}
      >
        <AlertDialogContent className="max-w-md">
          <AlertModalHeader
            icon={alertConfig.type === 'success' ? CheckCircle2 : AlertCircle}
            tone={alertConfig.type === 'success' ? 'success' : 'destructive'}
            title={alertConfig.title}
            description={alertConfig.message}
          />
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAlertConfig({ ...alertConfig, show: false })
                if (alertConfig.onConfirm) alertConfig.onConfirm()
              }}
              className={`cursor-pointer ${alertConfig.type === 'success' ? 'bg-primary hover:bg-primary/90' : 'bg-destructive hover:bg-destructive/90'} text-white border-0 px-8`}
            >
              {alertConfig.type === 'success' ? 'Continue' : 'Okay'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
