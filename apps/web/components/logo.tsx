import Link from "next/link"
import { Landmark } from "lucide-react"

/**
 * Text + icon wordmark for Iconic Rome Tickets.
 * `tone="light"` is for dark surfaces (footer, video section).
 */
export default function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light"
  className?: string
}) {
  const nameColor = tone === "light" ? "text-white" : "text-ink"
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
        <Landmark size={22} strokeWidth={1.75} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl font-semibold tracking-tight ${nameColor}`}>
          Iconic Rome
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
          Tickets
        </span>
      </span>
    </Link>
  )
}
