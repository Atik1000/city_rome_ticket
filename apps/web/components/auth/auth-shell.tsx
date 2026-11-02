"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Logo from "@/components/logo"

interface AuthShellProps {
    eyebrow: string
    title: string
    subtitle: string
    children: React.ReactNode
}

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAF7F2]">
            {/* Brand panel */}
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/carousel1.jpg')" }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#1C120D]/95 via-[#2A1B16]/70 to-[#2A1B16]/35" />
                <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />

                <div className="relative z-10 p-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium tracking-wide">Back to home</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 p-10 pb-14"
                >
                    <p className="text-gold uppercase tracking-[0.25em] text-xs font-semibold mb-4">
                        Local guides · Instant mobile tickets
                    </p>
                    <h2 className="font-serif text-4xl xl:text-5xl font-semibold text-white leading-tight max-w-md">
                        The Eternal City, one booking away.
                    </h2>
                    <div aria-hidden="true" className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
                    <p className="mt-5 text-white/75 max-w-sm leading-relaxed">
                        Skip-the-line access to the Colosseum, Vatican, Pantheon and more —
                        free cancellation on every tour.
                    </p>
                </motion.div>
            </div>

            {/* Form panel */}
            <div className="flex flex-col min-h-screen">
                <div className="flex items-center justify-between px-6 sm:px-10 pt-6">
                    <Link href="/" aria-label="Iconic Rome Tickets home">
                        <Logo />
                    </Link>
                    <Link
                        href="/"
                        className="lg:hidden inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-md"
                    >
                        <p className="eyebrow mb-3">{eyebrow}</p>
                        <h1 className="font-serif text-4xl font-semibold text-ink">{title}</h1>
                        <p className="text-ink/60 mt-2 mb-8">{subtitle}</p>
                        {children}
                    </motion.div>
                </div>

                <p className="px-6 sm:px-10 pb-6 text-xs text-ink/45">
                    © 2019 – 2026 Iconic Rome Tickets · iconicrometours.com
                </p>
            </div>
        </div>
    )
}
