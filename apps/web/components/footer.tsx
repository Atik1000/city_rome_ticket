"use client"
import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"
import Logo from "./logo"

const paymentLogos = [
  { src: "/visa-logo.jpg", alt: "Visa" },
  { src: "/mastercard-logo.jpg", alt: "Mastercard" },
  { src: "/amex-logo.jpg", alt: "American Express" },
  { src: "/paypal-logo.png", alt: "PayPal" },
  { src: "/apple-pay-logo.png", alt: "Apple Pay" },
  { src: "/google-pay-logo.jpg", alt: "Google Pay" },
]

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="w-full bg-[#1d1712] text-white">
      {/* Gold hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand / short description */}
          <div className="lg:col-span-6">
            <div className="space-y-5">
              <Logo tone="light" />

              <p className="text-xs text-white/50 tracking-[0.25em] uppercase">
                {t.footer.toursTickets}
              </p>

              <p className="text-sm text-white/80 leading-relaxed max-w-md">
                {t.footer.tagline}
              </p>

              {/* Quick contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="mailto:info@iconicrometickets.com"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                >
                  <span className="h-9 w-9 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                    <Mail size={18} />
                  </span>
                  <span className="text-sm text-white break-all">
                    info@iconicrometickets.com
                  </span>
                </a>

                <a
                  href="tel:+393710462213"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                >
                  <span className="h-9 w-9 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                    <Phone size={18} />
                  </span>
                  <span className="text-sm text-white">+39 371 046 2213</span>
                </a>
              </div>

              <p className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={16} className="text-gold" /> Rome, Italy
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Support */}
            <div>
              <h3 className="font-semibold text-sm tracking-widest uppercase text-gold/90">
                {t.footer.support}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/contact" className="text-white/75 hover:text-white transition">
                    {t.footer.contact}
                  </Link>
                </li>
                <li>
                  <Link href="/legal-notice" className="text-white/75 hover:text-white transition">
                    {t.footer.legalNotice}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-white/75 hover:text-white transition">
                    {t.footer.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-white/75 hover:text-white transition">
                    {t.footer.terms}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-sm tracking-widest uppercase text-gold/90">
                {t.footer.company}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/about-us" className="text-white/75 hover:text-white transition">
                    {t.footer.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/75 hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/tour" className="text-white/75 hover:text-white transition">
                    {t.nav.tours}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payments */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-sm tracking-widest uppercase text-gold/90">
                We accept
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-2 max-w-[180px]">
                {paymentLogos.map((p) => (
                  <span
                    key={p.alt}
                    className="flex h-9 items-center justify-center rounded-md bg-white px-1.5"
                  >
                    <img src={p.src} alt={p.alt} className="max-h-6 w-auto object-contain" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/10" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/55 text-center sm:text-left">
            © 2019 – 2026 Iconic Rome Tickets · iconicrometickets.com
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-white/80" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
