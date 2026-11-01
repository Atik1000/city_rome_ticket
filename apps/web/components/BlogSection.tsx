"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "How to Book Italy Attractions Like a Pro: Skip-the-Line, Timed Entry & Smart Tips",
    excerpt:
      "Italy’s top sights sell out fast—especially in peak season. Learn when to book, how timed-entry works, and how skip-the-line tickets can save you hours in Rome, Florence, and Venice.",
    image: "/blogs/thumb_how_to_book_italy.png",
    date: "February 15, 2026",
    category: "Travel Tips",
    link: "/blog/italy-top-sights",
  },
  {
    id: 2,
    title: "Colosseum, Roman Forum & Palatine Hill – Private 3 Hour Tour (What’s Worth It?)",
    excerpt:
      "Thinking about a private Colosseum tour? Here’s what you’ll actually see in 3 hours, who it’s best for, and how it compares to standard entry or group tours.",
    image: "/blogs/thumb_Colosseum_Roman.png",
    date: "February 10, 2026",
    category: "Day Trips",
    link: "/blog/private-3-hour-tour",
  },
  {
    id: 3,
    title:
      "Vatican Museums & Sistine Chapel: A Complete Visitor Guide",
    excerpt:
      "The Vatican Museums and the Sistine Chapel are among the most visited cultural sites in the world. Located within Vatican City, these landmarks offer an extraordinary journey through art, history, and religion.",
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80",
    date: "March 2026",
    category: "Ticket Guide",
    link: "/blog/vatican-sistine",
  },
  {
    id: 4,
    title:
      "St. Peter’s Basilica & Colosseum: What to Know Before You Visit",
    excerpt:
      "Rome is home to some of the most iconic landmarks in the world, and two of the most essential stops on any itinerary are St. Peter’s Basilica and the Colosseum. While they represent very different eras of history, both offer unforgettable experiences.",
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80",
    date: "March 2026",
    category: "Ticket Guide",
    link: "/blog/stpeter-colosseum",
  },
  {
    id: 5,
    title:
      "First Time in Rome? The Perfect 3-Day Itinerary (With Smart Ticket Planning)",
    excerpt:
      "Planning your first trip to Rome can feel overwhelming. With so many iconic landmarks, long queues, and limited time, having a smart itinerary is essential. This 3-day plan helps you experience the best of Rome while booking tickets strategically to avoid crowds.",
    image: "https://images.unsplash.com/photo-1537799943037-f5da89a65689?auto=format&fit=crop&w=1200&q=80",
    date: "March 2026",
    category: "Tour Itinerary",
    link: "/blog/first-time-rome",
  },
  {
    id: 6,
    title:
      "Rome Travel Tips 2026: 15 Mistakes Tourists Make (And How to Avoid Them)",
    excerpt:
      "Rome is one of the most visited cities in the world—but many travelers make simple mistakes that cost time, money, and experience. Here are 15 common mistakes and how you can avoid them for a smoother trip.",
    image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=80",
    date: "March 2026",
    category: "Travel Tips",
    link: "/blog/rome-travel-tips",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const BlogSection = () => {
  return (
    <section className="w-full bg-cream/50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="eyebrow mb-3">Stories & tips</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4 leading-[1.1]">
            From Our <span className="italic text-brand">Travel Journal</span>
          </h2>
          <div aria-hidden="true" className="gold-rule w-28 mx-auto mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ticket tips, itinerary ideas, and local insights to help you explore Italy smoothly.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              className="group bg-card rounded-2xl overflow-hidden border border-gold/20 shadow-warm hover:shadow-warm-lg hover:border-gold/40 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-espresso/10 via-40% to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-espresso/85 border border-gold/50 text-gold-light text-[11px] font-semibold uppercase tracking-[0.12em] rounded-full backdrop-blur">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.15em] mb-3">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  <span>{blog.date}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold leading-snug text-foreground mb-3 group-hover:text-brand transition-colors duration-300">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <a
                  href={blog.link}
                  className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:gap-3 transition-all duration-300"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/blog">
            <Button variant="outline" size="lg" className="gap-2">
              View All Posts <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;