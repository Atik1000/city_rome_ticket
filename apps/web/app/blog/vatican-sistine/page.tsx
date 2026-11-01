"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const VaticanSistineBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/vatican-sistine.png"
            alt="Vatican Museums and Sistine Chapel"
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
                  Vatican Museums & Sistine Chapel: A Complete Visitor Guide
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
                    The Vatican Museums and the Sistine Chapel are among the most visited cultural sites in the world. Located within Vatican City, these landmarks offer an extraordinary journey through art, history, and religion.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">What Are the Vatican Museums?</h2>
                  <p className="text-muted-foreground mb-6">
                    The Vatican Museums are a vast complex of galleries, halls, and corridors filled with artworks collected by the Popes over centuries. The collection includes classical sculptures, Renaissance masterpieces, tapestries, maps, and more.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Over 20,000 artworks on display</li>
                      <li>✔️ Includes Raphael Rooms and Gallery of Maps</li>
                      <li>✔️ One of the largest museum complexes in the world</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">The Sistine Chapel Explained</h2>
                  <p className="text-muted-foreground mb-6">
                    The Sistine Chapel is the final highlight of the Vatican Museums visit. It is world-famous for Michelangelo’s ceiling frescoes and "The Last Judgment" on the altar wall.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 my-8">
                    <p className="italic text-foreground">
                      The Sistine Chapel is not just art — it is a functioning chapel where papal conclaves are held.
                    </p>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">How Long Does a Visit Take?</h2>
                  <p className="text-muted-foreground mb-6">
                    A typical visit takes between 2 to 4 hours, depending on your pace. The walking distance inside the museums is significant, so comfortable footwear is recommended.
                  </p>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Best Time to Visit</h2>
                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Early morning (before 10 AM)</li>
                      <li>✔️ Late afternoon slots</li>
                      <li>❌ Midday is the most crowded</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Ticket Tips</h2>
                  <p className="text-muted-foreground mb-6">
                    Booking tickets in advance is essential. Skip-the-line tickets or guided tours can save hours of waiting time.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 my-8">
                    <ul className="space-y-3 text-muted-foreground">
                      <li>✔️ Always pre-book tickets</li>
                      <li>✔️ Consider guided tours for deeper insights</li>
                      <li>✔️ Audio guides are a good alternative</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Important Visitor Rules</h2>
                  <p className="text-muted-foreground mb-6">
                    Visitors must follow a strict dress code. Shoulders and knees must be covered. Photography is not allowed inside the Sistine Chapel.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 my-8">
                    <p className="italic text-foreground">
                      Silence is required inside the Sistine Chapel to preserve its sacred atmosphere.
                    </p>
                  </div>

                  <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts</h2>
                  <p className="text-muted-foreground mb-6">
                    Visiting the Vatican Museums and Sistine Chapel is a must when in Rome. With proper planning and early booking, you can fully enjoy one of the greatest artistic experiences in the world.
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
                      Plan Your Vatican Visit
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Discover guided tours and priority access tickets.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        View Tickets
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

export default VaticanSistineBlog;