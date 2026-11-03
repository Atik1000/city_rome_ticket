"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, Lightbulb, ArrowUpRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { sendContactMessage } from "@/services/tourService"

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 mb-2"

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendContactMessage(formData)
      setFormData(emptyForm)
      toast.success("Message sent — our team will get back to you within 24 hours.")
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to send message. Please try again later."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 lg:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-5">
                <span className="eyebrow">Contact us</span>
                <span aria-hidden="true" className="gold-rule hidden sm:block w-16" />
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold leading-[1.08]">
                Every great journey starts{" "}
                <span className="italic text-brand">with a conversation.</span>
              </h1>

              <p className="mt-5 text-[15px] sm:text-base text-ink/70 max-w-xl">
                Questions about your visit? Our Rome-based team is here to help.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-gold/25 shadow-warm-lg aspect-[4/3] lg:aspect-[16/11]">
                <img
                  src="/images/carousel1.jpg"
                  alt="Roman colonnade at golden hour"
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact details + form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-warm-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left: details panel */}
              <aside className="lg:col-span-5 relative bg-[linear-gradient(165deg,#8f2721_0%,#7e211c_45%,#641a16_100%)] text-white p-7 sm:p-9">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                />

                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
                  Let&rsquo;s talk Rome.
                </h2>
                <p className="mt-2 text-sm text-white/75">
                  We usually reply within 24 hours.
                </p>

                <div className="mt-7 border-y border-white/15 divide-y divide-white/15">
                  <a
                    href="mailto:info@iconicrometours.com"
                    className="group flex items-start gap-4 py-5"
                  >
                    <Mail size={22} className="text-gold shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <p className="font-semibold">Email us</p>
                      <p className="mt-1 text-sm text-white/80 break-all group-hover:text-gold-light transition-colors">
                        info@iconicrometours.com
                      </p>
                    </div>
                  </a>

                  <a href="tel:+393710462213" className="group flex items-start gap-4 py-5">
                    <Phone size={22} className="text-gold shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <p className="font-semibold">Call our team</p>
                      <p className="mt-1 text-sm text-white/80 group-hover:text-gold-light transition-colors">
                        +39 371 046 2213
                      </p>
                      <p className="mt-1 text-xs text-white/55">Mon&ndash;Sat, 9:00&ndash;18:00</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 py-5">
                    <MapPin size={22} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-white/85">Based in Rome, Italy</p>
                  </div>
                </div>

                <figure className="mt-7">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/20 aspect-[16/10]">
                    <img
                      src="/images/carousel2.jpg"
                      alt="Historic Roman facade in the city centre"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 font-serif italic text-sm text-white/75">
                    Local people. Personal support.
                  </figcaption>
                </figure>
              </aside>

              {/* Right: message form */}
              <div className="lg:col-span-7 p-7 sm:p-9">
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-ink/65">
                  We&rsquo;d love to hear from you. Fill in the form below and our team will
                  get back to you soon.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="first_name" className={labelClass}>
                        First name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        autoComplete="given-name"
                        className="input-warm"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className={labelClass}>
                        Last name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        autoComplete="family-name"
                        className="input-warm"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="input-warm"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone <span className="text-ink/40">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        className="input-warm"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-warm"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input-warm resize-none"
                      placeholder="Tell us about your plans..."
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-cream/60 px-4 py-3">
                    <Lightbulb size={18} className="text-gold shrink-0" />
                    <p className="text-sm text-ink/75">
                      Include your travel date for faster help.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-premium px-8 py-3.5 w-full sm:w-auto sm:min-w-[240px]"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Send message
                          <ArrowUpRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-ink/55 sm:border-l sm:border-ink/15 sm:pl-4">
                      We&rsquo;ll only use your details to respond to your enquiry.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Closing line */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="flex items-center gap-5 sm:gap-8">
            <span aria-hidden="true" className="gold-rule flex-1" />
            <p className="font-serif italic text-base sm:text-lg text-ink/75 text-center">
              A little local help makes all the difference.
            </p>
            <span aria-hidden="true" className="gold-rule flex-1" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
