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

const ColosseumPrivateTourBlog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/blogs/Colosseum_Roman.png"
            alt="Colosseum Roman Forum Palatine Hill Private Tour"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 15%" }} // center horizontally, top vertically
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
                  Rome Tours
                </span>

                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-soft-white mb-4 max-w-4xl">
                  Colosseum, Roman Forum & Palatine Hill – Private 3 Hour Tour
                  (What’s Worth It?)
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
                    <span>6 min read</span>
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
                <h1 className="font-heading text-3xl font-semibold text-foreground mb-4 max-w-4xl">
                  Colosseum, Roman Forum & Palatine Hill – Private 3 Hour Tour
                  (What’s Worth It?)
                </h1>
                <div className="prose prose-lg max-w-none">
                  <p className="text-md text-muted-foreground leading-relaxed mb-8">
                    If you’re visiting Rome, the Colosseum, Roman Forum, and
                    Palatine Hill are absolutely unmissable. But with huge
                    crowds, long lines, and centuries of history packed into one
                    area, many travelers ask:{" "}
                    <strong>
                      Is a private 3-hour tour really worth it?
                    </strong>
                    <br />
                    Here’s what you actually get — and whether it’s the right
                    choice for your trip.
                  </p>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Why This Area Is So Important
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Colosseum wasn’t just an arena. The Roman Forum wasn’t
                    just ruins. Palatine Hill wasn’t just a viewpoint.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Together, these three sites form the political, religious,
                    and social heart of Ancient Rome. Without context, they can
                    feel like “beautiful stones.” With the right guide, they
                    become living history.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          🏟️ Colosseum:
                        </strong>
                        <br />
                        Gladiator battles, emperors, and 50,000 roaring
                        spectators.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🏛 Roman Forum:
                        </strong>
                        <br />
                        The center of Roman politics, speeches, and public life.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🌿 Palatine Hill:
                        </strong>
                        <br />
                        The birthplace of Rome and home of imperial palaces.
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    What Makes a Private 3-Hour Tour Different?
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A standard group tour might cover the highlights. A private
                    tour transforms the experience.
                  </p>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>
                        <strong className="text-foreground">
                          👤 100% Personalized:
                        </strong>
                        <br />
                        Ask questions, slow down for photos, or focus on the
                        topics that interest you most.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          ⏱️ Efficient Use of Time:
                        </strong>
                        <br />
                        No waiting for large groups. Smooth pacing and
                        skip-the-line coordination.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          🎓 Deeper Storytelling:
                        </strong>
                        <br />
                        A licensed guide brings ancient Rome to life with
                        context you won’t get from signs.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          📸 Better Experience:
                        </strong>
                        <br />
                        Your guide can help you find the best viewpoints on
                        Palatine Hill and inside the Colosseum.
                      </li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Is 3 Hours Enough?
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Yes — if structured properly. Three hours is the ideal
                    balance between depth and energy.
                  </p>

                  <ol className="text-muted-foreground leading-relaxed mb-6">
                    <li>
                      Start inside the <strong>Colosseum</strong> (about 1 hour).
                    </li>
                    <li>
                      Continue through the <strong>Roman Forum</strong> (1–1.5
                      hours).
                    </li>
                    <li>
                      Finish on <strong>Palatine Hill</strong> for views and
                      imperial history (30–45 minutes).
                    </li>
                  </ol>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Longer tours can feel overwhelming. Shorter ones often rush
                    the Forum. Three hours is the sweet spot.
                  </p>

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 md:p-8 my-8">
                    <p className="text-foreground font-medium italic text-md leading-relaxed">
                      If this is your first time in Rome, this tour gives you
                      the foundation to understand everything else you’ll see in
                      the city.
                    </p>
                    <p className="text-accent font-semibold mt-4">
                      — Team Cityrometickets
                    </p>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Who Should Choose a Private Tour?
                  </h2>

                  <div className="bg-secondary/50 rounded-2xl p-6 md:p-8 my-8">
                    <ul className="space-y-4 text-muted-foreground">
                      <li>✔️ Families who want flexible pacing</li>
                      <li>✔️ Couples looking for a premium experience</li>
                      <li>✔️ History lovers who want detailed explanations</li>
                      <li>✔️ Travelers with limited time in Rome</li>
                      <li>✔️ Visitors who prefer avoiding large groups</li>
                    </ul>
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Is It Worth the Price?
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A private tour costs more than general entry or a large
                    group tour. But what you gain is:
                  </p>

                  <ul className="text-muted-foreground leading-relaxed mb-6">
                    <li>Time saved</li>
                    <li>Stress reduced</li>
                    <li>Richer storytelling</li>
                    <li>A fully personalized experience</li>
                  </ul>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    For many travelers, this is the highlight of their Rome
                    trip.
                  </p>

                  <h2 className="font-heading text-xl font-semibold text-foreground mt-12 mb-6">
                    Final Verdict
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    If you want more than photos — if you want to truly
                    understand Ancient Rome — the Colosseum, Roman Forum &
                    Palatine Hill Private 3 Hour Tour is absolutely worth it.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    It turns ruins into stories, and sightseeing into a powerful
                    experience.
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
                          Rome Tours & Experiences
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We specialize in curated Rome tours, priority tickets, and
                      private experiences designed to make your visit smooth,
                      efficient, and unforgettable.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-charcoal rounded-2xl p-6 text-center">
                    <h3 className="font-heading text-xl font-semibold text-soft-white mb-3">
                      Ready to Explore Ancient Rome?
                    </h3>
                    <p className="text-soft-white/70 text-sm mb-4">
                      Book your private Colosseum tour today and experience
                      history without the stress.
                    </p>
                    <Link href="/tour">
                      <Button variant="secondary" className="w-full">
                        View Tour Details
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

export default ColosseumPrivateTourBlog;