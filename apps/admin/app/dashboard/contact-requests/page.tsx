'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, AlertCircle, Search, RotateCcw, ArrowRightLeft } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { MotionTableRow, staggerIn } from '@/components/motion'
import { StatusModal } from '@/components/dashboard/status-modal'
import { ContactRequestModal } from '@/components/dashboard/contact-request-modal'
import { PageHeader } from '@/components/dashboard/page-header'
import { PageLoader } from '@/components/dashboard/page-loader'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getContactRequests, ContactRequest } from '@/app/lib/api'
import { useAuth } from '@/app/contexts/auth-context'

const ITEMS_PER_PAGE = 10

interface UIContactRequest {
  id: string
  name: string
  email: string
  message: string
  status: string
  createdAt: string
  subject: string
  phone: string
  cancelled_reason: string | null
}

export default function ContactRequestsPage() {
  const { token } = useAuth()
  const reduceMotion = useReducedMotion()
  const [requests, setRequests] = useState<UIContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchRequests = async (searchQuery?: string) => {
    if (!token) return
    try {
      setLoading(true)
      const data = await getContactRequests(token, searchQuery)
      const mapped = data.results.map((r: any) => ({
        id: String(r.id),
        name: `${r.first_name} ${r.last_name}`,
        email: r.email,
        message: r.message,
        status: r.status,
        createdAt: r.created_at || new Date().toISOString(),
        subject: r.subject,
        phone: r.phone,
        cancelled_reason: r.cancelled_reason
      }))
      setRequests(mapped)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching contact requests:', err)
      setError('Failed to load contact requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests(search)
  }, [token, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE)
  const paginatedRequests = requests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const selectedRequest = requests.find((r) => r.id === selectedRequestId)

  const handleStatusChange = () => {
    fetchRequests()
  }

  if (loading && requests.length === 0) {
    return <PageLoader label="Loading requests" className="min-h-[400px]" />
  }

  if (error && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium text-foreground">{error}</p>
        <Button onClick={() => fetchRequests()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Inbox"
        title="Contact Requests"
        description="Manage customer inquiries and requests"
        actions={
          <>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search requests..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-[200px] sm:w-[280px] pl-9 bg-card"
                  aria-label="Search contact requests"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button type="submit" className="cursor-pointer shadow-lg shadow-primary/15">Search</Button>
            </form>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </>
        }
      />

      {/* Requests Table - Responsive */}
      <Card className="border-border/80 overflow-hidden shadow-warm p-0 gap-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="pl-5">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      title="No contact requests found"
                      description="New customer inquiries will appear here as they arrive."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request, i) => (
                  <MotionTableRow
                    key={`${currentPage}-${request.id}`}
                    className="border-border/70 hover:bg-accent/35 transition-colors"
                    {...staggerIn(i, reduceMotion)}
                  >
                    <TableCell className="pl-5 font-semibold text-foreground text-xs sm:text-sm truncate">#{request.id}</TableCell>
                    <TableCell className="text-foreground text-xs sm:text-sm truncate">{request.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm truncate break-all">{request.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">
                      {request.createdAt !== 'N/A'
                        ? new Date(request.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex justify-end gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="border-border text-muted-foreground hover:text-primary hover:bg-primary/10 bg-transparent rounded-lg cursor-pointer"
                              aria-label={`View request #${request.id}`}
                              onClick={() => {
                                setSelectedRequestId(request.id)
                                setDetailsModalOpen(true)
                              }}
                            >
                              <Eye size={15} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View request</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="border-border text-muted-foreground hover:text-primary hover:bg-primary/10 bg-transparent rounded-lg cursor-pointer"
                              aria-label={`Update status of request #${request.id}`}
                              onClick={() => {
                                setSelectedRequestId(request.id)
                                setStatusModalOpen(true)
                              }}
                            >
                              <ArrowRightLeft size={15} />
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
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="border-border text-sm h-10 px-4 flex-shrink-0 rounded-lg hover:bg-secondary transition-all"
          >
            Previous
          </Button>

          <div className="flex gap-1 flex-shrink-0">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-sm h-10 w-10 p-0 rounded-lg transition-all ${currentPage === i + 1
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
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
            className="border-border text-sm h-10 px-4 flex-shrink-0 rounded-lg hover:bg-secondary transition-all"
          >
            Next
          </Button>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <ContactRequestModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false)
            setSelectedRequestId(null)
          }}
          request={selectedRequest}
        />
      )}

      {/* Status Modal */}
      {selectedRequest && token && (
        <StatusModal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false)
            setSelectedRequestId(null)
          }}
          onSave={handleStatusChange}
          currentStatus={selectedRequest.status}
          id={selectedRequest.id}
          token={token}
          type="contact"
          statusOptions={["open", "in_review", "cancelled", "completed"]}
        />
      )}
    </div>
  )
}
