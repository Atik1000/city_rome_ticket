'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'
import { ModalHeader } from '@/components/dashboard/modal-header'
import { StatusBadge } from '@/components/dashboard/status-badge'

interface ContactRequest {
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

interface ContactRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: ContactRequest
}

export function ContactRequestModal({
  isOpen,
  onClose,
  request,
}: ContactRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <Card className="border-none shadow-none p-0 gap-0 max-h-[90vh] flex flex-col bg-transparent">
          {/* Header inside Card */}
          <div className="p-6 border-b border-border/70 bg-warm-wash">
            <ModalHeader
              icon={MessageSquare}
              title="Contact Request Details"
              description={`Request #${request.id} from ${request.name}`}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 overflow-y-auto space-y-8">
            <div className="space-y-6">
              {/* ID & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Request ID</p>
                  <p className="text-base font-semibold text-foreground">#{request.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-base font-bold text-primary">{request.subject || 'No Subject'}</p>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-base font-semibold text-foreground">{request.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-base font-semibold text-foreground break-all">{request.email}</p>
                </div>
              </div>

              {/* Phone & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-base font-semibold text-foreground">{request.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Status</p>
                  <StatusBadge status={request.status} />
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Submitted At</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(request.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {/* Cancelled Reason */}
              {request.cancelled_reason && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="gold-hairline mb-6" aria-hidden="true" />
                  <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-4">Cancellation Reason</p>
                  <div className="bg-destructive/5 p-5 rounded-xl border border-destructive/15">
                    <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                      {request.cancelled_reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <div className="gold-hairline mb-6" aria-hidden="true" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Customer Message</p>
                <div className="bg-secondary/30 p-5 rounded-xl border border-border/50">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm font-medium">
                    {request.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer inside Card */}
          <div className="p-6 border-t border-border/70 bg-secondary/30">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 h-11 rounded-lg shadow-lg shadow-primary/15 transition-all active:scale-95 cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
