import Link from "next/link"
import Image from "next/image"

/**
 * Official wordmark used across the storefront.
 */
export default function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <Link href="/" aria-label="City Rome Tickets home" className={`group inline-flex items-center ${className}`}>
      <Image
        src="/images/logo_city_roam_tickets-transparent.png"
        alt="City Rome Tickets"
        width={666}
        height={374}
        priority
        className={`h-auto w-[126px] object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:w-[142px] ${tone === "light" ? "brightness-0 invert" : ""}`}
      />
    </Link>
  )
}
