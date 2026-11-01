"use client"

import React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TypingDots from "@/components/TypingDots";
import { Phone, Mail, Users, Calendar, ShieldCheck, Tag } from "lucide-react"

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-[#2A2118]">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left: Image with text and badge */}
                        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
                            <div
                                className="
                                relative overflow-hidden rounded-2xl shadow-2xl
                                w-[220px] h-[220px]
                                sm:w-[260px] sm:h-[260px]
                                md:w-[300px] md:h-[300px]
                                lg:w-[340px] lg:h-[340px]
                                xl:w-[380px] xl:h-[380px]
                                "
                            >
                                <img
                                src="/images/memory_1.webp"
                                alt="Scenic landscape"
                                className="w-full h-full object-cover object-center"
                                loading="lazy"
                                />
                            </div>
                        </div>



                        {/* Right: Content */}
                        <div className="w-full lg:w-1/2 ">
                            <h4 className="text-brand uppercase tracking-widest text-sm font-semibold mb-4">
                            <TypingDots text="Iconic Rome Tickets" />
                            </h4>
                            <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight mb-8">
                                Rome, Without the Waiting
                            </h1>
                            <p className="text-dark/70 text-[15px] leading-relaxed mb-3">
                                Iconic Rome Tickets is a Rome-based booking service built around one simple idea: your time in the Eternal City should be spent inside its monuments, not queuing outside them. We pair skip-the-line entry to the Colosseum, the Vatican Museums, St. Peter&apos;s Basilica and more with licensed local guides who know every stone and story.
                            </p>
                            <p className="text-dark/70 text-[15px] leading-relaxed mb-10">
                                Every itinerary is designed by people who live here — timed around the crowds, paced for real visitors, and backed by free cancellation and instant mobile tickets. From first-time travelers to returning romantics, we make two thousand years of history feel effortless.
                            </p>

                            <div className="flex flex-wrap gap-6 items-center">
                                {/* <button className="bg-[#C8963E] hover:bg-[#75a61f] text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                                    <Mail size={18} />
                                    Let&apos;s talk now
                                </button> */}
                                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                    <Mail size={18} className="text-[#C8963E]" />
                                    <a href="mailto:info@iconicrometickets.com">info@iconicrometickets.com</a>
                                </div>
                                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                    <Phone size={18} className="text-[#C8963E]" />
                                    <span>+39 371 046 2213</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                {/* Why Choose Us Section */}
                <section className="relative min-h-screen w-full overflow-hidden">
                  {/* Background Video */}
                  <div className="absolute inset-0 z-0">
                    <video
                      className="h-full w-full object-cover brightness-[0.6]"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src="images/about_video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Overlay (helps text readability on bright scenes) */}
                    <div className="absolute inset-0 bg-[#2A2118]/60" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex min-h-screen items-center">
                    <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center text-white sm:px-6 lg:px-8">
                      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-gold-light sm:text-sm">
                        Great Experience
                      </span>

                      <h2 className="mb-10 text-3xl font-semibold leading-tight sm:text-4xl md:mb-14 md:text-5xl">
                        Why choose us
                      </h2>

                      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                            <Users size={24} className="text-white" />
                          </div>
                          <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                            Leading travel agency
                          </h3>
                          <p className="text-sm leading-relaxed text-white/90">
                            Top-rated agency in Italy is renowned for exceptional service and unforgettable travel experiences.
                          </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                            <Calendar size={24} className="text-white" />
                          </div>
                          <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                            Years of experience in tour operations
                          </h3>
                          <p className="text-sm leading-relaxed text-white/90">
                            With years of expertise, we excel at organizing seamless, enjoyable, and memorable tours for every traveler.
                          </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                            <ShieldCheck size={24} className="text-white" />
                          </div>
                          <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                            Flexible tour packages and bookings
                          </h3>
                          <p className="text-sm leading-relaxed text-white/90">
                            We offer customizable trips with flexible packages and convenient booking options tailored to your needs.
                          </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                            <Tag size={24} className="text-white" />
                          </div>
                          <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                            Best prices with attractive offers
                          </h3>
                          <p className="text-sm leading-relaxed text-white/90">
                            Enjoy unbeatable prices and exclusive offers, ensuring you receive great value with memorable vacation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

            </main>
            <Footer />
        </div>
    )
}
