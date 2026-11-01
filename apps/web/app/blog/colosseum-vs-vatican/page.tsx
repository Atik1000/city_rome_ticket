"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"


import { Button } from "@/components/ui/button";
// import blogHero from "@/assets/blog-n-3.png"; // Replace with Rome landmarks image if available

const RomeTicketComparisonBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/collusum_vatican.png"
            alt="Colosseum vs Vatican vs Borghese"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 78%" }} // center horizontally, top vertically
          />
          
        </section>


        {/* <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-custom pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full mb-4">
                  Ticket Guide
                </span>

                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-soft-white mb-4 max-w-4xl">
                  Colosseum vs Vatican vs Borghese: Which Rome Ticket Should You
                  Book First?
                </h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-soft-white/80 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Team Italia Tickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>February 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>7 min read</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div> */}

        {/* Content Section */}
        <section className="py-10 md:py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <h2 className="font-heading text-3xl font-semibold text-foreground mb-4 max-w-4xl">Colosseum vs Vatican vs Borghese: Which Rome Ticket Should You Book First?</h2>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-soft-white/80 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Team Cityrometickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>February 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>7 min read</span>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none mt-10">
                  <p className="text-md text-muted-foreground leading-relaxed mb-8">
                    If you’re planning a trip to Rome, you’ll quickly face a big
                    question:
                    <strong>
                      {" "}
                      Which major attraction should I book first — Colosseum,
                      Vatican, or Borghese Gallery?
                    </strong>
                    <br />
                    All three are world-famous. All require timed tickets. And
                    all can sell out.
                    <br />
                    Here’s how to decide strategically.
                  </p>

                  {/* Overview Section */}
                  <h2 className="font-heading text-2xl font-semibold text-foreground mt-12 mb-6">
                    Quick Comparison at a Glance
                  </h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-5 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          🏟 Colosseum:
                        </strong>
                        <br />
                        Iconic ancient amphitheater + Roman Forum + Palatine
                        Hill. Outdoor + indoor mix.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🎨 Vatican Museums:
                        </strong>
                        <br />
                        Massive art collections + Sistine Chapel. Fully indoor.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🖼 Borghese Gallery:
                        </strong>
                        <br />
                        Small, elegant museum with Bernini & Caravaggio
                        masterpieces. Strict capacity limits.
                      </li>
                    </ul>
                  </div>

                  {/* Section 1 */}
                  <h2 className="font-heading text-lg font-semibold text-foreground mt-12 mb-6">
                    1) The Most Competitive Ticket: Borghese Gallery
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Surprise: the smallest museum is often the hardest to book.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Borghese Gallery allows a limited number of visitors per
                    time slot (usually 2-hour sessions). Once a slot sells out,
                    that’s it.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8 my-8">
                    <p className="text-foreground font-medium italic text-md">
                      If Borghese is on your must-see list, book this ticket
                      first — especially in peak season.
                    </p>
                    <p className="text-accent font-semibold mt-4">
                      — Team Cityrometickets
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Because capacity is tightly controlled, even “low season”
                    weekends can fill up quickly.
                  </p>

                  {/* Section 2 */}
                  <h2 className="font-heading text-lg font-semibold text-foreground mt-12 mb-6">
                   2) The Most Popular Overall: Vatican Museums
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Vatican Museums receive millions of visitors annually.
                    Lines can stretch for hours without pre-booked tickets.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    While there are many time slots available daily, the best
                    ones (early morning or late afternoon) sell out first.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>✔️ Essential to book in advance</li>
                      <li>✔️ Consider skip-the-line or guided entry</li>
                      <li>✔️ Early slots = fewer crowds inside</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    If you only have 2–3 days in Rome, the Vatican should be one
                    of your first confirmed bookings.
                  </p>

                  {/* Section 3 */}
                  <h2 className="font-heading text-lg font-semibold text-foreground mt-12 mb-6">
                    3) The Icon of Rome: Colosseum & Roman Forum
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Colosseum is the symbol of Rome — and one of the most
                    visited landmarks in the world.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Entry is timed, and many ticket types exist (standard,
                    arena floor, underground, guided tours).
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        ✔️ Underground tours sell out fastest
                      </li>
                      <li>
                        ✔️ Arena floor access is limited
                      </li>
                      <li>
                        ✔️ Standard entry has more availability
                      </li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    If you want special access areas (like underground or arena
                    floor), book this before the Vatican.
                  </p>

                  {/* Strategic Advice */}
                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    So… What Should You Book First?
                  </h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
                      <li>
                        If you want Borghese → <strong>Book Borghese first.</strong>
                      </li>
                      <li>
                        If you want Colosseum Underground/Arena →{" "}
                        <strong>Book Colosseum first.</strong>
                      </li>
                      <li>
                        Otherwise → <strong>Book Vatican early slots first.</strong>
                      </li>
                    </ol>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    After securing your most competitive ticket, build your
                    itinerary around those time slots.
                  </p>

                  {/* Pro Tip */}
                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8 my-8">
                    <p className="text-foreground font-medium italic text-md">
                      The smartest travelers don’t book in order of excitement —
                      they book in order of availability.
                    </p>
                    <p className="text-accent font-semibold mt-4">
                      — Team Cityrometickets
                    </p>
                  </div>

                  {/* Final Thoughts */}
                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Final Recommendation
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    If all three are must-sees, aim to spread them across
                    different days. This prevents museum fatigue and gives you
                    time to enjoy Rome’s neighborhoods in between.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Plan smart. Book strategically. And let Rome unfold at the
                    right pace.
                  </p>
                </div>

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t border-border">
                  <Link href="/">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.article>

              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-4"
              >
                <div className="lg:sticky lg:top-28 space-y-8">

                  {/* Author */}
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      About the Author
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Team Cityrometickets
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rome Tours & Ticket Experts
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We help travelers navigate Rome’s most in-demand
                      attractions with priority tickets, timed entry access, and
                      curated guided tours.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-charcoal rounded-2xl p-6 text-center">
                    <h3 className="font-heading text-xl font-semibold text-soft-white mb-3">
                      Ready to Secure Your Tickets?
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Explore skip-the-line options and guided tours for Rome’s
                      top attractions.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        Browse Tours & Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RomeTicketComparisonBlog;