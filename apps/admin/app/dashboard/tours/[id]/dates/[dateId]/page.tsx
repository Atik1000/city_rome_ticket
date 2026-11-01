'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { TimeFormModal } from '@/components/dashboard/time-form-modal'
import { PageHeader } from '@/components/dashboard/page-header'
import { PageLoader } from '@/components/dashboard/page-loader'
import { EmptyState } from '@/components/dashboard/empty-state'
import { AlertModalHeader } from '@/components/dashboard/modal-header'
import { getTourTimes, TourTime, deleteTourTime } from '@/app/lib/api'
import { getCookie } from '@/app/lib/cookies'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TimesPage() {
  const params = useParams()
  const tourId = params.id as string
  const dateId = params.dateId as string

  const [timeSlots, setTimeSlots] = useState<TourTime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [editingTime, setEditingTime] = useState<TourTime | null>(null)

  // Deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  })

  const fetchTimes = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = getCookie('access_token')
      if (token && dateId) {
        const response = await getTourTimes(token, dateId)
        setTimeSlots(response.results)
      } else if (!token) {
        setError('Authentication token not found. Please log in again.')
      }
    } catch (err) {
      setError('Failed to fetch time slots. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [dateId])

  useEffect(() => {
    fetchTimes()
  }, [fetchTimes])

  const handleDelete = async () => {
    if (!idToDelete) return

    try {
      setIsDeleting(true)
      const token = getCookie('access_token')
      if (!token) {
        throw new Error('Authentication token not found.')
      }

      await deleteTourTime(token, dateId, idToDelete)

      setAlertConfig({
        show: true,
        title: 'Success',
        message: 'Time slot deleted successfully.',
        type: 'success'
      })

      fetchTimes()
    } catch (err: any) {
      let errorMessage = 'Failed to delete time slot. Please try again.'
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
      setIdToDelete(null)
    }
  }

  const selectedDate = new Date(timeSlots[0]?.tour_date.date || '').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) || 'Date'

  if (isLoading && timeSlots.length === 0) {
    return <PageLoader label="Loading time slots" className="min-h-screen" />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Card className="p-8 max-w-md border-border">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{error}</h2>
          <Button onClick={fetchTimes} className="mt-4">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow="Schedule"
        backHref={`/dashboard/tours/${tourId}`}
        title={`Time Slots for ${timeSlots[0] ? selectedDate : 'this date'}`}
        description="Manage available time slots and tickets"
        actions={
          <Button
            onClick={() => {
              setEditingTime(null)
              setTimeModalOpen(true)
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/15"
          >
            <Plus size={20} />
            Add New Time
          </Button>
        }
      />

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timeSlots.map((slot) => (
          <Card key={slot.id} className="border-border/80 overflow-hidden hover:shadow-warm-lg transition-shadow p-0 gap-0">
            {/* Time Header */}
            <div className="bg-warm-wash p-4 border-b border-border/70">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-primary mb-1 tabular-nums">
                {slot.start_time.substring(0, 5)}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Total Capacity: {
                  slot.available_adults +
                  slot.available_children +
                  slot.available_infants +
                  slot.available_youth +
                  slot.available_student_eu
                }
              </p>
            </div>

            {/* Ticket Details */}
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                {[
                  ['Adult', slot.available_adults],
                  ['Child', slot.available_children],
                  ['Infant', slot.available_infants],
                  ['Youth', slot.available_youth],
                  ['Student EU', slot.available_student_eu],
                ].map(([label, count]) => (
                  <div
                    key={label as string}
                    className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {count} tickets
                    </span>
                  </div>
                ))}
              </div>

              <div className='flex flex-row gap-2 pt-1'>
                {/* Edit Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingTime(slot)
                    setTimeModalOpen(true)
                  }}
                  className="flex-1 border-border text-foreground hover:text-primary hover:bg-primary/10 bg-card flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit size={18} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIdToDelete(slot.id.toString())
                    setIsDeleteDialogOpen(true)
                  }}
                  className="flex-1 border-destructive/25 text-destructive hover:text-destructive hover:bg-destructive/10 bg-card flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && timeSlots.length === 0 && (
        <Card className="p-0 border-border/80">
          <EmptyState
            title="No time slots scheduled"
            description="Add the first time slot to open this date for bookings."
            action={
              <Button
                onClick={() => {
                  setEditingTime(null)
                  setTimeModalOpen(true)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-lg shadow-primary/15"
              >
                <Plus size={18} />
                Add First Time Slot
              </Button>
            }
          />
        </Card>
      )}

      {/* Time Form Modal */}
      <TimeFormModal
        isOpen={timeModalOpen}
        onClose={() => {
          setTimeModalOpen(false)
          setEditingTime(null)
        }}
        onSave={fetchTimes}
        mode={editingTime ? 'edit' : 'create'}
        tourDateId={dateId}
        initialData={editingTime}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertModalHeader
            icon={Trash2}
            tone="destructive"
            title="Delete this time slot?"
            description="This action cannot be undone. The time slot will be permanently deleted."
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setIdToDelete(null)} className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Feedback Alert Dialog */}
      <AlertDialog
        open={alertConfig.show}
        onOpenChange={(open) => !open && setAlertConfig(prev => ({ ...prev, show: false }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={alertConfig.type === 'error' ? 'text-destructive' : 'text-primary'}>
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line text-foreground">
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertConfig(prev => ({ ...prev, show: false }))}
              className="cursor-pointer"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
