"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const RomeLandmarksBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/stpeter-colosseum.png"
            alt="St Peter's Basilica and Colosseum"
            className="w-full h-full object-cover"
          />
        </section>

        {/* Content Section */}
        <section className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Main Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8"
              >
                <h1 className="font-heading text-3xl font-semibold text-foreground mb-4">
                  St. Peter’s Basilica & Colosseum: What to Know Before You Visit
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
                    <span>6 min read</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mt-10">

                  <p className="text-muted-foreground mb-6">
                    Rome is home to some of the most iconic landmarks in the world, and two of the most essential stops on any itinerary are St. Peter’s Basilica and the Colosseum. While they represent very different eras of history, both offer unforgettable experiences.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">St. Peter’s Basilica Overview</h2>
                  <p className="text-muted-foreground mb-6">
                    Located in Vatican City, St. Peter’s Basilica is one of the largest and most important churches in the world. It is a masterpiece of Renaissance architecture and a central place of worship for the Catholic Church.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Designed by artists like Michelangelo and Bernini</li>
                      <li>✔️ Home to Michelangelo’s Pietà</li>
                      <li>✔️ Free entry (queue required)</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Visitors can also climb to the top of the dome for panoramic views of Rome, making it one of the most rewarding viewpoints in the city.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Colosseum Overview</h2>
                  <p className="text-muted-foreground mb-6">
                    The Colosseum is an ancient Roman amphitheater and one of the most recognizable symbols of Rome. Built nearly 2,000 years ago, it once hosted gladiator battles and public spectacles.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Includes access to Roman Forum & Palatine Hill</li>
                      <li>✔️ Multiple ticket types available</li>
                      <li>✔️ Timed entry required</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Key Differences</h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li><strong>St. Peter’s Basilica:</strong> Religious site, free entry, dress code required</li>
                      <li><strong>Colosseum:</strong> Historical monument, paid ticket, timed entry</li>
                      <li><strong>Experience:</strong> Basilica is calm and spiritual, Colosseum is immersive and historical</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Best Time to Visit</h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Visit St. Peter’s early morning to avoid queues</li>
                      <li>✔️ Book Colosseum early slots for fewer crowds</li>
                      <li>✔️ Avoid weekends if possible</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Ticket & Entry Tips</h2>
                  <p className="text-muted-foreground mb-6">
                    While St. Peter’s Basilica is free to enter, security lines can be long. Guided tours or skip-the-line dome tickets can save time. The Colosseum, on the other hand, always requires advance booking.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Pre-book Colosseum tickets</li>
                      <li>✔️ Consider guided tours for both sites</li>
                      <li>✔️ Combine Colosseum with Forum & Palatine visit</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts</h2>
                  <p className="text-muted-foreground mb-6">
                    St. Peter’s Basilica and the Colosseum showcase two sides of Rome — one spiritual and artistic, the other ancient and dramatic. Visiting both gives you a complete understanding of the city’s rich heritage.
                  </p>

                </div>

                {/* Back Button */}
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
                      Explore Rome’s Top Attractions
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Book tickets and guided tours for a seamless experience.
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

export default RomeLandmarksBlog;
