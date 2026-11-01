"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const RomeMistakesBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/rome-travel-tips.png"
            alt="Rome travel tips mistakes"
            className="w-full h-full object-cover"
          />
        </section>

        {/* Content */}
        <section className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Main */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8"
              >
                <h1 className="font-heading text-3xl font-semibold mb-4">
                  Rome Travel Tips 2026: 15 Mistakes Tourists Make (And How to Avoid Them)
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Team Cityrometickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>March 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>9 min read</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mt-10">

                  <p className="text-muted-foreground mb-6">
                    Rome is one of the most visited cities in the world—but many travelers make simple mistakes that cost time, money, and experience. Here are 15 common mistakes and how you can avoid them for a smoother trip.
                  </p>

                  {/* Mistakes List */}

                  {[
                    "Not booking tickets in advance",
                    "Visiting major attractions at peak hours",
                    "Underestimating walking distances",
                    "Ignoring dress codes at religious sites",
                    "Not choosing the right ticket type",
                    "Trying to see everything in one day",
                    "Skipping early morning time slots",
                    "Not planning Vatican visit properly",
                    "Ignoring combo tickets",
                    "Eating only near tourist spots",
                    "Not carrying water in summer",
                    "Forgetting comfortable shoes",
                    "Not validating transport tickets",
                    "Visiting only famous spots",
                    "Overpacking your itinerary",
                  ].map((mistake, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">
                        {index + 1}. {mistake}
                      </h2>
                      <p className="text-muted-foreground">
                        <strong>Fix:</strong> Plan ahead and make smart choices to avoid this common issue. Booking in advance, choosing the right timing, and balancing your itinerary can significantly improve your experience.
                      </p>
                    </div>
                  ))}

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts</h2>
                  <p className="text-muted-foreground mb-6">
                    Avoiding these common mistakes will help you experience Rome more efficiently and enjoyably. A little planning goes a long way in making your trip stress-free and memorable.
                  </p>

                </div>

                {/* Back */}
                <div className="mt-12 pt-8 border-t">
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
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4"
              >
                <div className="lg:sticky lg:top-28 space-y-8">

                  <div className="bg-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">Team Cityrometickets</p>
                        <p className="text-sm text-muted-foreground">Rome Travel Experts</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-charcoal rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-semibold text-soft-white mb-3">
                      Avoid the Hassle in Rome
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Book tickets early and skip long queues.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        Explore Tickets
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

export default RomeMistakesBlog;
