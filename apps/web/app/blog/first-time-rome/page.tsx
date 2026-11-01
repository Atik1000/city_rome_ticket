"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const RomeItineraryBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/rome-itinerary.png"
            alt="Rome 3 Day Itinerary"
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
                  First Time in Rome? The Perfect 3-Day Itinerary (With Smart Ticket Planning)
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
                    <span>8 min read</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mt-10">

                  <p className="text-muted-foreground mb-6">
                    Planning your first trip to Rome can feel overwhelming. With so many iconic landmarks, long queues, and limited time, having a smart itinerary is essential. This 3-day plan helps you experience the best of Rome while booking tickets strategically to avoid crowds.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Day 1: Ancient Rome Highlights</h2>
                  <p className="text-muted-foreground mb-6">
                    Start your journey with Rome’s most iconic historical landmarks — the Colosseum, Roman Forum, and Palatine Hill.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Colosseum (morning entry recommended)</li>
                      <li>✔️ Roman Forum & Palatine Hill</li>
                      <li>✔️ Sunset at Capitoline Hill</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    <strong>Smart Tip:</strong> Book your Colosseum tickets in advance, especially if you want arena or underground access.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Day 2: Vatican City Experience</h2>
                  <p className="text-muted-foreground mb-6">
                    Dedicate your second day to Vatican City — home to some of the world’s greatest artistic treasures.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Vatican Museums</li>
                      <li>✔️ Sistine Chapel</li>
                      <li>✔️ St. Peter’s Basilica</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    <strong>Smart Tip:</strong> Choose early morning or late afternoon Vatican tickets to avoid peak crowds.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Day 3: Rome’s Charm & Hidden Gems</h2>
                  <p className="text-muted-foreground mb-6">
                    Spend your final day exploring Rome’s beautiful piazzas, fountains, and local neighborhoods.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Trevi Fountain</li>
                      <li>✔️ Pantheon</li>
                      <li>✔️ Piazza Navona</li>
                      <li>✔️ Optional: Borghese Gallery</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    <strong>Smart Tip:</strong> If you plan to visit Borghese Gallery, book tickets early — slots sell out quickly.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Ticket Planning Strategy</h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Book Colosseum first (limited access areas sell out fast)</li>
                      <li>✔️ Secure Vatican tickets next</li>
                      <li>✔️ Add Borghese only if needed</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts</h2>
                  <p className="text-muted-foreground mb-6">
                    With the right plan, you can experience Rome’s highlights without stress. Prioritize booking your most competitive tickets first, and let the rest of your itinerary flow around them.
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
                      Plan Your Rome Trip
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Book tickets and tours to skip the lines and save time.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        Browse Tickets
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

export default RomeItineraryBlog;
