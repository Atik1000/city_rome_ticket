"use client"

import { Ticket, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface BookingSuccessModalProps {
    open: boolean
    /** Called whenever the modal is dismissed — by the button, the X, Esc or the backdrop. */
    onClose: () => void
    bookingId?: number | string
    totalPrice?: string
}

/** Small dots that burst out from the check mark once it has been drawn. */
const SPARKS = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2
    return { x: Math.cos(angle) * 80, y: Math.sin(angle) * 80, gold: i % 2 === 0 }
})

function AnimatedCheck() {
    return (
        <div className="relative mx-auto mb-5 flex h-32 w-32 items-center justify-center">
            {/* Expanding pulse rings */}
            {[0, 1].map((i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-green-400/25"
                    initial={{ scale: 0.6, opacity: 0.7 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 2, delay: 0.6 + i * 0.8, repeat: Infinity, ease: "easeOut" }}
                />
            ))}

            {/* Spark burst */}
            {SPARKS.map((s, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    className={`absolute h-2.5 w-2.5 rounded-full ${s.gold ? "bg-gold" : "bg-green-500"}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x: s.x, y: s.y, scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.75, ease: "easeOut" }}
                />
            ))}

            {/* Solid green disc */}
            <motion.div
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-[0_12px_40px_-8px_rgba(22,163,74,0.6)]"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
            >
                {/* Check mark that draws itself */}
                <svg viewBox="0 0 52 52" className="h-14 w-14" aria-hidden="true">
                    <motion.path
                        d="M14 27 L23 36 L39 18"
                        fill="none"
                        stroke="white"
                        strokeWidth={5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
                    />
                </svg>
            </motion.div>
        </div>
    )
}

export function BookingSuccessModal({ open, onClose, bookingId, totalPrice }: BookingSuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
            <DialogContent
                showCloseButton={false}
                // The sticky navbar sits at z-[100]; stay above it so it can't cover the check mark.
                overlayClassName="z-[110] bg-black/60 backdrop-blur-[2px]"
                className="z-[110] max-h-[calc(100dvh-2rem)] overflow-y-auto gap-0 p-0 border-gold/30 bg-white rounded-3xl shadow-2xl sm:max-w-xl"
            >
                {/* Gold hairline */}
                <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

                <div className="px-6 pt-8 pb-7 text-center sm:px-12 sm:pt-10 sm:pb-9">
                    <AnimatedCheck />

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <p className="eyebrow mb-3">Iconic Rome Tickets</p>
                        <DialogTitle className="font-serif text-4xl font-semibold text-green-700 sm:text-5xl">
                            Booking confirmed!
                        </DialogTitle>
                        <DialogDescription className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
                            Grazie! Your reservation is secured. Your skip-the-line tickets are on
                            their way.
                        </DialogDescription>
                    </motion.div>

                    {(bookingId || totalPrice) && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="mt-6 rounded-2xl border border-gold/25 bg-[#FAF7F2] divide-y divide-gold/15 text-left"
                        >
                            {bookingId && (
                                <div className="flex items-center justify-between px-5 py-4">
                                    <span className="flex items-center gap-2.5 text-base text-ink/65">
                                        <Ticket size={20} className="text-gold" />
                                        Booking reference
                                    </span>
                                    <span className="text-lg font-semibold text-ink">#{bookingId}</span>
                                </div>
                            )}
                            {totalPrice && (
                                <div className="flex items-center justify-between px-5 py-4">
                                    <span className="flex items-center gap-2.5 text-base text-ink/65">
                                        <Wallet size={20} className="text-gold" />
                                        Total paid
                                    </span>
                                    <span className="font-serif text-2xl font-semibold text-ink">
                                        €{totalPrice}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        autoFocus
                        className="btn-premium mt-6 w-full py-4 text-lg"
                    >
                        Done
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
