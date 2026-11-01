"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { sendContactMessage } from "@/services/tourService"

export default function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

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
      setIsSuccessOpen(true)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      toast({
        title: "Success",
        description: "Your message has been sent successfully.",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-[#2A2118] flex flex-col">
      <Navbar />

      {/* 1) Thin picture background header */}
      <section className="relative h-40 sm:h-44 md:h-52 w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* Use any image you have in /public, e.g. /ocean.jpg */}
          <img
            src="/ocean.jpg"
            alt="Contact header"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2A2118]/60" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80">
              Get in touch
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Contact us
            </h1>
          </div>
        </div>
      </section>

      {/* 2) Content compact so the form fits in one viewport */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* This wrapper keeps everything within the remaining viewport height (after header/navbar/footer),
              and allows scrolling only if absolutely necessary (very small screens). */}
          <div className="min-h-[calc(100vh-220px)] sm:min-h-[calc(100vh-240px)] md:min-h-[calc(100vh-280px)] flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Contact Info (compact + nicer card) */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[#2A2118]">
                      Contact details
                    </h2>
                    <p className="text-sm text-gray-500">
                      We usually reply within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-brand rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Mail size={20} />
                      </div>
                      <div className="leading-tight">
                        <p className="font-semibold text-[#2A2118]">Email</p>
                        <a
                          className="text-brand-dark font-semibold text-sm hover:underline break-all"
                          href="mailto:info@iconicrometickets.com"
                        >
                          info@iconicrometickets.com
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Send us an email anytime
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-brand rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Phone size={20} />
                      </div>
                      <div className="leading-tight">
                        <p className="font-semibold text-[#2A2118]">Phone</p>
                        <a
                          className="text-brand-dark font-semibold text-sm hover:underline"
                          href="tel:+393710462213"
                        >
                          +39 371 046 2213
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Mon–Sat, 9:00–18:00
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-cream border border-cream p-4">
                    <p className="text-sm text-[#2A2118] font-semibold">
                      Tip:
                      <span className="font-normal text-gray-600">
                        {" "}
                        Add your travel date in the message for faster help.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Form (compact heights so it fits in one screen) */}
              <div className="lg:col-span-8">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2A2118]">
                        Send us a message
                      </h2>
                      <p className="text-sm text-gray-500">
                        We’ll get back to you soon.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-widest text-brand">
                      Iconic Rome Tickets
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-xs font-semibold text-[#2A2118] mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm"
                          placeholder="First name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-xs font-semibold text-[#2A2118] mb-2"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm"
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-[#2A2118] mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-[#2A2118] mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-[#2A2118] mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-[#2A2118] mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand outline-none transition text-gray-700 placeholder:text-gray-400 shadow-sm resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By sending this form, you agree to be contacted back by email or phone.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <DialogContent className="sm:max-w-[425px] border-none shadow-2xl p-0 overflow-hidden rounded-3xl">
            <div className="relative p-10 bg-white">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-cream rounded-full blur-2xl opacity-50 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-green-400 blur-xl opacity-20 animate-pulse rounded-full" />
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center shadow-inner transform rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <DialogTitle className="text-3xl font-semibold text-[#2A2118] tracking-tight">
                    Message Sent!
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 text-lg leading-relaxed">
                    We&apos;ve received your inquiry and our team will get back to you within 24 hours.
                  </DialogDescription>
                </div>

                <div className="w-full pt-4">
                  <button
                    onClick={() => setIsSuccessOpen(false)}
                    className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-dark text-white font-semibold py-4 rounded-xl shadow-lg shadow-cream-dark transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                  >
                    Awesome, thanks!
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}
