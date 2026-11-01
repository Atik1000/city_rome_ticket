"use client"

import React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LegalNoticePage() {
    return (
        <div className="min-h-screen bg-background font-sans text-[#2A2118]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-2xl font-semibold leading-tight mb-8">Legal Notice</h1>

                <div className="prose prose-slate max-w-none space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-[#2A2118] mb-4">1. Identification</h2>
                        <p>
                            This website is operated by Iconic Rome Tickets. Our official address is located in Via santamaura 32, Italy.
                            For any inquiries, you can contact us at <a href="mailto:info@iconicrometickets.com">info@iconicrometickets.com</a> or via phone at +39 371 046 2213.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#2A2118] mb-4">2. Intellectual Property</h2>
                        <p>
                            All content on this website, including text, graphics, logos, and images, is the property of Iconic Rome Tickets
                            and is protected by international copyright laws. Unauthorized use of any content is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#2A2118] mb-4">3. Limitation of Liability</h2>
                        <p>
                            Iconic Rome Tickets strives to ensure the information on this website is accurate and up-to-date. However,
                            we do not guarantee the completeness or accuracy of the information. We are not liable for any direct or
                            indirect damages arising from the use of this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#2A2118] mb-4">4. Governing Law</h2>
                        <p>
                            This Legal Notice is governed by and construed in accordance with the laws of Italy. Any disputes
                            arising in connection with this notice shall be subject to the exclusive jurisdiction of the courts of Rome.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
