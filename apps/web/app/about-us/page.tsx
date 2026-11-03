"use client"

import React from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  Users,
  CalendarDays,
  Ticket,
  Smartphone,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react"

const highlights = [
  {
    icon: Users,
    title: "Local expertise",
    body: "Work with licensed local guides who share Rome's history and culture with real insight.",
  },
  {
    icon: CalendarDays,
    title: "Thoughtful itineraries",
    body: "Carefully designed tours that highlight Rome's iconic landmarks and meaningful hidden gems.",
  },
  {
    icon: Ticket,
    title: "Flexible booking",
    body: "Plan your trip with ease thanks to flexible options that fit your schedule and travel style.",
    featured: true,
  },
  {
    icon: Smartphone,
    title: "Instant mobile tickets",
    body: "Get your tickets right away on your phone, so you can spend less time planning and more time exploring.",
  },
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-ink">
      <Navbar />

      <main>
        {/* Hero banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gold/25 shadow-warm-lg">
            <img
              src="/images/carousel1.jpg"
              alt="Rome at golden hour"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-espresso/92 via-espresso/70 to-espresso/25"
            />

            <div className="relative px-6 sm:px-10 lg:px-14 py-14 sm:py-16 lg:py-20 max-w-2xl text-white">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
                The people behind your journey
              </p>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-20 bg-gold-light/70"
              />

              <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12]">
                More than tickets.
                <br />A connection to Rome.
              </h1>

              <p className="mt-5 text-sm sm:text-base text-white/85">
                Local knowledge. Timeless stories. Extraordinary experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Our story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow">Our story</p>
              <span aria-hidden="true" className="gold-rule mt-4 block w-20" />

              <h2 className="mt-6 font-serif text-4xl sm:text-5xl font-semibold leading-[1.08]">
                Rome, without
                <br />
                <span className="italic text-brand">the waiting.</span>
              </h2>

              <p className="mt-6 text-[15px] leading-relaxed text-ink/75">
                Iconic Rome Tickets is a Rome-based booking service built around one
                simple idea: to make it easy for you to experience the Eternal City
                without the waiting, uncertainty, or hassle.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
                We work with licensed local guides who know Rome inside and out — from
                its world-famous landmarks to its hidden corners — bringing the city&rsquo;s
                history, culture, and stories to life in a meaningful and authentic way.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="relative pb-14 sm:pb-16 lg:pr-16">
                <div className="overflow-hidden rounded-2xl ring-1 ring-gold/25 shadow-warm-lg aspect-[4/3]">
                  <img
                    src="/images/memory_1.webp"
                    alt="Travellers exploring Italy with a local guide"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Overlapping secondary image */}
                <div className="absolute right-0 bottom-6 hidden lg:block w-56 xl:w-64 overflow-hidden rounded-2xl ring-4 ring-background shadow-warm-lg aspect-[4/3]">
                  <img
                    src="/images/carousel2.jpg"
                    alt="Historic Roman monument"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Caption chip */}
                <div className="absolute left-5 sm:left-8 bottom-9 rounded-xl border border-gold/30 bg-cream px-5 py-3 shadow-warm">
                  <p className="font-serif italic text-sm sm:text-base text-ink">
                    Rooted in Rome. Made for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* A better way */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:pb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-center leading-tight">
            A better way to <span className="italic text-brand">experience Rome</span>
          </h2>

          <div
            aria-hidden="true"
            className="mt-6 mb-10 flex items-center justify-center gap-3"
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map(({ icon: Icon, title, body, featured }) => (
              <article
                key={title}
                className={
                  featured
                    ? "h-full rounded-2xl bg-brand text-white p-6 shadow-glow-brand"
                    : "h-full rounded-2xl border border-gold/25 bg-white p-6 shadow-warm transition-shadow duration-300 hover:shadow-warm-lg"
                }
              >
                <Icon
                  size={30}
                  strokeWidth={1.6}
                  className={featured ? "text-white" : "text-brand"}
                />

                <h3
                  className={`mt-5 font-serif text-xl font-semibold leading-snug ${
                    featured ? "text-white" : "text-ink"
                  }`}
                >
                  {title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    featured ? "text-white/85" : "text-ink/70"
                  }`}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(165deg,#8f2721_0%,#7e211c_45%,#641a16_100%)] text-white px-7 sm:px-10 lg:px-14 py-10 lg:py-12">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold leading-[1.1]">
                  Your Roman story
                  <br className="hidden sm:block" /> starts here.
                </h2>
                <p className="mt-4 text-sm sm:text-[15px] text-white/80 max-w-md">
                  Get in touch with our team for friendly support, tour advice, or help
                  with your booking.
                </p>
              </div>

              <div className="lg:col-span-5 lg:border-l lg:border-white/20 lg:pl-12">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-serif text-base font-semibold text-ink shadow-warm transition-colors hover:bg-cream"
                >
                  Talk to our team
                  <ArrowUpRight size={18} className="text-brand" />
                </Link>

                <div className="mt-6 space-y-3">
                  <a
                    href="mailto:info@iconicrometours.com"
                    className="group flex items-center gap-3 text-sm text-white/90 hover:text-gold-light transition-colors"
                  >
                    <Mail size={18} className="text-gold shrink-0" />
                    <span className="break-all">info@iconicrometours.com</span>
                  </a>

                  <a
                    href="tel:+393710462213"
                    className="group flex items-center gap-3 text-sm text-white/90 hover:text-gold-light transition-colors"
                  >
                    <Phone size={18} className="text-gold shrink-0" />
                    +39 371 046 2213
                  </a>
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
