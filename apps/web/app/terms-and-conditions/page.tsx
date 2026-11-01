"use client"

import React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-[#2A2118]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <p className="eyebrow mb-3">Iconic Rome Tickets</p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">Terms and Conditions</h1>
                <div aria-hidden="true" className="gold-rule mb-10" />

                <div className="prose prose-slate max-w-none space-y-6 text-ink/70 leading-relaxed">
                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you agree to comply with and be bound by these
                            Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">2. Booking and Payments</h2>
                        <p>
                            All bookings are subject to availability. Payments must be made in full at the time of
                            booking unless otherwise specified. We use secure payment gateways to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">3. Cancellation and Refunds</h2>
                        <p>
                            Cancellation policies vary by tour. Please review the specific terms for each tour before
                            making a booking. Refunds will be processed according to the applicable cancellation policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">4. Conduct and Safety</h2>
                        <p>
                            Participants are expected to behave appropriately and follow safety instructions during
                            all tours. Iconic Rome Tickets reserves the right to remove any participant who
                            endangers others or disrupts the tour.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
