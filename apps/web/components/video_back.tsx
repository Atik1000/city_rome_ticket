export default function VideoBackgroundPage() {
  return (
    <main className="relative w-full min-h-[70vh] overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        src="/s_tour.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center gap-4">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.4em] text-gold-light">
          Iconic Rome Tickets
        </p>
        <h2 className="font-serif text-white text-4xl sm:text-6xl md:text-7xl font-semibold text-balance">
          Book the Past,
          <br />
          Experience the Eternal.
        </h2>
        <div className="mt-4 h-px w-24 bg-gold/70" />
        <p className="text-white/85 text-base sm:text-lg max-w-xl">
          Two thousand years of history, one unforgettable visit.
        </p>
      </div>
    </main>
  )
}
