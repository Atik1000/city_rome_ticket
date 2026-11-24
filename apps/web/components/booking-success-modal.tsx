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
const SPARKS = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2
    const dist = i % 2 === 0 ? 120 : 95
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, gold: i % 2 === 0 }
})

function AnimatedCheck() {
    return (
        <div className="relative mx-auto mb-6 flex h-44 w-44 items-center justify-center">
            {/* Expanding pulse rings */}
            {[0, 1].map((i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-green-400/30"
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

            {/* Green ring that draws itself around the disc */}
            <svg viewBox="0 0 176 176" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <motion.circle
                    cx="88"
                    cy="88"
                    r="82"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </svg>

            {/* Solid green disc */}
            <motion.div
                className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-[0_16px_50px_-8px_rgba(22,163,74,0.65)]"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
            >
                {/* Check mark that draws itself */}
                <svg viewBox="0 0 52 52" className="h-20 w-20" aria-hidden="true">
                    <motion.path
                        d="M14 27 L23 36 L39 18"
                        fill="none"
                        stroke="white"
                        strokeWidth={5.5}
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
                className="z-[110] max-h-[calc(100dvh-2rem)] overflow-y-auto gap-0 p-0 border-gold/30 bg-white rounded-3xl shadow-2xl sm:max-w-2xl"
            >
                {/* Gold hairline */}
                <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

                <div className="bg-gradient-to-b from-green-50 via-white to-white px-6 pt-10 pb-8 text-center sm:px-14 sm:pt-12 sm:pb-10">
                    <AnimatedCheck />

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <p className="eyebrow mb-3">Iconic Rome Tickets</p>
                        <DialogTitle className="font-serif text-4xl font-semibold text-green-700 sm:text-6xl">
                            Booking confirmed!
                        </DialogTitle>
                        <DialogDescription className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink/75 sm:text-xl">
                            Grazie! Your reservation is secured. Your skip-the-line tickets are on
                            their way.
                        </DialogDescription>
                    </motion.div>

                    {(bookingId || totalPrice) && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="mt-8 rounded-2xl border border-gold/25 bg-[#FAF7F2] divide-y divide-gold/15 text-left"
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
                        className="btn-premium mt-8 w-full py-4 text-lg"
                    >
                        Done
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
