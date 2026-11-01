"use client"

import React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-[#2A2118]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <p className="eyebrow mb-3">Iconic Rome Tickets</p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">Privacy Policy</h1>
                <div aria-hidden="true" className="gold-rule mb-10" />

                <div className="prose prose-slate max-w-none space-y-6 text-ink/70 leading-relaxed">
                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account,
                            make a booking, or contact our support team. This may include your name, email address,
                            phone number, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to process your bookings, communicate with you about
                            your tours, and improve our services. We may also use your information for marketing
                            purposes with your consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">3. Data Sharing and Disclosure</h2>
                        <p>
                            We do not sell your personal information to third parties. We may share your information
                            with trusted partners who assist us in operating our website and providing our services,
                            subject to strict confidentiality agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-4">4. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. If you wish
                            to exercise any of these rights, please contact us at example@gmail.com.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
