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
// import blog2 from "@/assets/blog-n-3.png"; // replace with your Italy attractions hero image if you have one

const BookItalyAttractionsLikeAPro = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
          <img
            src="/blogs/how_to_book_italy.png"
            alt="How to book Italy attractions like a pro"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 38%" }} // center horizontally, top vertically
          />
          
        </section>

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
                <h2 className="font-heading text-3xl font-semibold text-foreground mb-4 max-w-4xl">How to Book Italy Attractions Like a Pro: Skip-the-Line, Timed Entry & Smart Tips</h2>
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
                <div className="prose prose-lg max-w-none mt-8">
                  <p className="text-md text-muted-foreground leading-relaxed mb-8">
                    Italy is magical—until you’re standing in a 2-hour line under
                    the sun, only to find out the next entry slot is sold out.
                    The good news: with a few booking strategies, you can visit
                    top attractions smoothly, save time, and build a better
                    itinerary. This guide explains{" "}
                    <strong>skip-the-line tickets</strong>,{" "}
                    <strong>timed entry</strong>, and the{" "}
                    <strong>smart tips travelers use</strong> to book Italy like
                    a pro.
                  </p>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    First, Know What You’re Booking
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Not all “tickets” are the same. In Italy, popular sites have
                    different access rules depending on the attraction, season,
                    and time of day. Before you click “Book,” look for these key
                    terms:
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          🎟️ Standard Entry:
                        </strong>
                        <br />
                        Entry to the attraction without priority access. Often
                        requires waiting in the general line.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          ⏱️ Timed Entry:
                        </strong>
                        <br />
                        You choose a specific time slot (e.g., 10:30). Arrive
                        early and enter around that window.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🚀 Skip-the-Line / Priority Access:
                        </strong>
                        <br />
                        Separate entrance or faster queue for ticket holders.
                        You still pass security checks.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🎧 Guided Tour Entry:
                        </strong>
                        <br />
                        Entry included with a licensed guide—great when tickets
                        are limited or you want stories and context.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🧾 Combo Pass / Bundle:
                        </strong>
                        <br />
                        Multiple attractions in one purchase. Can be cost-saving
                        if your schedule is firm.
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    What “Skip-the-Line” Actually Means (And What It Doesn’t)
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    “Skip-the-line” doesn’t mean you walk straight in with zero
                    waiting. In most major attractions, there are two steps:
                    <strong> ticket validation</strong> and{" "}
                    <strong>security screening</strong>. Priority access usually
                    speeds up the ticket line, but security can still have a
                    queue—especially in peak times.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8 my-8">
                    <p className="text-foreground font-medium italic text-md">
                      Pro tip: visit early morning or late afternoon for the
                      fastest security lines, even if you already have priority
                      access.
                    </p>
                    <p className="text-accent font-semibold mt-4">
                      — Team Cityrometickets
                    </p>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Timed Entry: The Secret to a Stress-Free Day
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Timed entry is your best friend in Italy. It locks in your
                    visit and helps you plan the rest of your day without
                    guesswork. But it only works if you plan around it.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      A simple timed-entry plan that works
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          30–45 minutes before:
                        </strong>{" "}
                        arrive near the attraction (metro/taxi delays happen).
                      </li>
                      <li>
                        <strong className="text-foreground">15 minutes before:</strong>{" "}
                        join the correct line (priority / timed-entry).
                      </li>
                      <li>
                        <strong className="text-foreground">After entry:</strong>{" "}
                        keep the next 1–2 hours flexible (don’t stack tight
                        bookings back-to-back).
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    When to Book: A Practical Rule of Thumb
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Booking windows vary, but here’s the simple strategy:
                    <strong> book your “must-do” attractions first</strong>,
                    then fill the rest of your itinerary around them.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          Peak season (Apr–Oct):
                        </strong>
                        <br />
                        Book major attractions and popular day trips as early as
                        possible.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Shoulder season (Mar, Nov):
                        </strong>
                        <br />
                        Still book ahead for the “big names,” but you’ll have
                        more flexibility for smaller museums.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Low season (Dec–Feb):
                        </strong>
                        <br />
                        Great for spontaneity—except during holiday weeks and
                        weekends in major cities.
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Smart Booking Mistakes to Avoid
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Most travel stress comes from small mistakes. Avoid these
                    and your day feels effortless.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          ❌ Booking attractions too close together:
                        </strong>
                        <br />
                        Give yourself buffers for walking, transport, and
                        security lines.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          ❌ Ignoring entry rules:
                        </strong>
                        <br />
                        Some attractions require ID, specific names on tickets,
                        or strict time windows.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          ❌ Choosing the “cheapest” option without reading details:
                        </strong>
                        <br />
                        A “ticket” might be an audio guide only, a reservation
                        only, or a meeting-point voucher.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          ❌ Forgetting about Mondays and closure days:
                        </strong>
                        <br />
                        Some museums close one day a week—plan around it.
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    The Pro Move: Build Your Itinerary Backwards
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Here’s how experienced travelers plan a day in Rome,
                    Florence, Venice, or Milan:
                  </p>

                  <ol className="text-muted-foreground leading-relaxed mb-6">
                    <li>
                      Pick 1–2 <strong className="text-foreground">anchor attractions</strong>{" "}
                      (timed entry).
                    </li>
                    <li>
                      Add <strong className="text-foreground">nearby sights</strong>{" "}
                      you can do anytime (squares, viewpoints, markets).
                    </li>
                    <li>
                      Reserve <strong className="text-foreground">one flexible activity</strong>{" "}
                      (a food tour, evening cruise, or a neighborhood walk).
                    </li>
                    <li>
                      Keep at least <strong className="text-foreground">one “empty gap”</strong>{" "}
                      for gelato, photos, and unexpected discoveries.
                    </li>
                  </ol>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8 my-8">
                    <p className="text-foreground font-medium italic text-md">
                      If your plan has no breathing room, it’s not a vacation—
                      it’s a schedule. Timed entry should create freedom, not
                      pressure.
                    </p>
                    <p className="text-accent font-semibold mt-4">
                      — Team Cityrometickets
                    </p>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Quick Checklist Before You Pay
                  </h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>
                        ✅ Is this <strong className="text-foreground">timed entry</strong>{" "}
                        or open entry?
                      </li>
                      <li>
                        ✅ Does it include <strong className="text-foreground">skip-the-line</strong>{" "}
                        (priority access), or just a reservation?
                      </li>
                      <li>
                        ✅ What’s the <strong className="text-foreground">meeting point</strong>{" "}
                        (if it’s a tour)?
                      </li>
                      <li>
                        ✅ Are <strong className="text-foreground">names/IDs required</strong>{" "}
                        for entry?
                      </li>
                      <li>
                        ✅ What are the <strong className="text-foreground">cancellation rules</strong>{" "}
                        and cutoff times?
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Book Italy the Easy Way
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Want us to help you plan the smoothest visit? We offer
                    curated tickets and tours with clear entry details, trusted
                    operators, and options for every travel style—solo, couples,
                    families, and groups.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Start with your city and date range, and we’ll recommend the
                    best ticket type (timed entry, priority access, or guided
                    tour) so you can spend less time organizing—and more time
                    exploring.
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
                  

                  {/* Author Profile */}
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
                          Tours & Attraction Tickets in Italy
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We help travelers explore Italy with smooth bookings,
                      trusted operators, and clear entry details. Our blog shares
                      practical ticketing tips, itinerary ideas, and local
                      insights—so you can spend more time experiencing Italy and
                      less time waiting in lines.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-charcoal rounded-2xl p-6 text-center">
                    <h3 className="font-heading text-xl font-semibold text-soft-white mb-3">
                      Ready to book your Italy experience?
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Browse top attractions, reserve timed entry, and choose
                      skip-the-line options for a smoother trip.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        Explore Tickets & Tours
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

export default BookItalyAttractionsLikeAPro;