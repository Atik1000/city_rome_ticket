import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Flourish from "@/components/decor/flourish"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-espresso">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-gold-light mb-6">
            Error CDIV — page not found
          </p>

          <h1 className="font-serif text-[6rem] sm:text-[8rem] leading-none font-semibold text-white">
            404
          </h1>

          <Flourish tone="light" className="my-8" />

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4">
            All roads lead to Rome — <span className="italic text-gold-light">this one didn&apos;t.</span>
          </h2>
          <p className="text-white/70 leading-relaxed mb-10">
            The page you&apos;re looking for has been lost to history. Head back and keep
            exploring the Eternal City.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-premium px-8 py-3.5 w-full sm:w-auto">
              Back to home
            </Link>
            <Link
              href="/tour"
              className="inline-flex items-center justify-center gap-2 font-semibold text-gold-light border border-gold/50 rounded-xl px-8 py-3.5 w-full sm:w-auto hover:bg-white/5 hover:border-gold transition-colors"
            >
              Browse tours
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
