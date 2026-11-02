"use client"

import { Check, Mail, Ticket } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface BookingSuccessModalProps {
    open: boolean
    /** Called whenever the modal is dismissed — by the button, the X, Esc or the backdrop. */
    onClose: () => void
    bookingId?: number | string
    totalPrice?: string
    email?: string
}

export function BookingSuccessModal({
    open,
    onClose,
    bookingId,
    totalPrice,
    email,
}: BookingSuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-md p-0 overflow-hidden border-gold/30 bg-white rounded-2xl"
            >
                {/* Gold hairline */}
                <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

                <div className="px-8 pt-8 pb-7 text-center">
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="mx-auto mb-5 w-20 h-20 rounded-full bg-green-50 ring-8 ring-green-50/60 flex items-center justify-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                        </div>
                    </motion.div>

                    <p className="eyebrow mb-2">Iconic Rome Tickets</p>
                    <DialogTitle className="font-serif text-3xl font-semibold text-ink">
                        Booking confirmed
                    </DialogTitle>
                    <DialogDescription className="text-ink/60 mt-2.5 leading-relaxed">
                        Grazie! Your reservation is secured. Your skip-the-line tickets are on
                        their way.
                    </DialogDescription>

                    {(bookingId || totalPrice) && (
                        <div className="mt-6 rounded-xl border border-gold/25 bg-[#FAF7F2] divide-y divide-gold/15 text-left">
                            {bookingId && (
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="flex items-center gap-2 text-sm text-ink/60">
                                        <Ticket size={16} className="text-gold" />
                                        Booking reference
                                    </span>
                                    <span className="font-semibold text-ink">#{bookingId}</span>
                                </div>
                            )}
                            {totalPrice && (
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-ink/60">Total paid</span>
                                    <span className="font-serif text-lg font-semibold text-ink">
                                        €{totalPrice}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {email && (
                        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink/55">
                            <Mail size={15} className="text-gold shrink-0" />
                            Confirmation sent to {email}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        autoFocus
                        className="btn-premium w-full py-3.5 mt-7"
                    >
                        Done
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
