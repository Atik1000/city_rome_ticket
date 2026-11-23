import Link from "next/link"
import Image from "next/image"

/**
 * Iconic Rome Tours logo.
 * tone="dark"  → navy/blue artwork for light backgrounds (navbar, auth pages).
 * tone="light" → original pale-blue/white artwork for dark backgrounds (footer).
 */
export default function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <Link href="/" aria-label="Iconic Rome Tours home" className={`group inline-flex items-center ${className}`}>
      <Image
        src={tone === "light" ? "/images/logo-iconic-rome-tours-light.png" : "/images/logo-iconic-rome-tours.png"}
        alt="Iconic Rome Tours"
        width={458}
        height={237}
        priority
        className="h-auto w-[104px] object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:w-[118px]"
      />
    </Link>
  )
}
