/**
 * Thin Roman-inspired gold flourish: hairline rules flanking a laurel sprig.
 * Decorative only (aria-hidden). Use `tone="light"` on dark/espresso surfaces.
 */
export default function Flourish({
  className = "",
  tone = "dark",
}: {
  className?: string
  tone?: "dark" | "light"
}) {
  const line = tone === "light" ? "via-gold-light/70" : "via-gold/60"
  const leaf = tone === "light" ? "text-gold-light" : "text-gold"
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px w-14 sm:w-20 bg-gradient-to-r from-transparent ${line} to-transparent`} />
      <svg
        width="34"
        height="14"
        viewBox="0 0 34 14"
        fill="none"
        className={`${leaf} shrink-0`}
      >
        {/* laurel sprig: mirrored leaves around a centre diamond */}
        <path
          d="M4 11 C7 9, 10 8.5, 13 9 C10.5 6.5, 7.5 6, 4 7 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M30 11 C27 9, 24 8.5, 21 9 C23.5 6.5, 26.5 6, 30 7 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <rect x="15.2" y="5.2" width="3.6" height="3.6" transform="rotate(45 17 7)" fill="currentColor" />
      </svg>
      <span className={`h-px w-14 sm:w-20 bg-gradient-to-r from-transparent ${line} to-transparent`} />
    </div>
  )
}
