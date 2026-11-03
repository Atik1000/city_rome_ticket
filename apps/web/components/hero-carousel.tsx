"use client"

import { useEffect, useState, useRef } from "react"
import { Search, CalendarDays, ChevronDown, ArrowUpRight, Users, Zap, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { API_BASE_URL } from "@/services/authService";
import AmbientParticles from "@/components/animation/ambient-particles"
import { gsap, useGSAP, prefersReducedMotion } from "@/components/animation/gsap"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TourSuggestion {
  id: number
  title: string
  price_adult: number
  duration?: string
  images?: { file: string }[]
  featured_image?: string
}

const slides = [
  { image: "/images/carousel2.jpg", alt: "Rome at dusk" },
  { image: "/images/carousel1.jpg", alt: "Roman colonnade at golden hour" },
]

const trustPoints = [
  { icon: Users, label: "Expert local guides" },
  { icon: Zap, label: "Instant confirmation" },
  { icon: Ticket, label: "Mobile tickets" },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<TourSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true)
        try {
          const response = await fetch(
            `${API_BASE_URL}/tour/plan/?search=${encodeURIComponent(searchQuery)}`
          )
          if (response.ok) {
            const data = await response.json()
            setSuggestions(data.results || data || [])
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Ken-Burns drift on the active hero image + headline words rising in on mount
  useGSAP(
    () => {
      if (prefersReducedMotion() || !heroRef.current) return
      const words = heroRef.current.querySelectorAll("[data-hero-word]")
      if (words.length) {
        gsap.fromTo(
          words,
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", stagger: 0.07 },
        )
      }
      const fade = heroRef.current.querySelectorAll("[data-hero-fade]")
      if (fade.length) {
        gsap.fromTo(
          fade,
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", stagger: 0.12, delay: 0.2 },
        )
      }
    },
    { scope: heroRef },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion() || !heroRef.current) return
      const image = heroRef.current.querySelector(`[data-hero-image="${currentSlide}"]`)
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.12, xPercent: 0.8 },
          { scale: 1.02, xPercent: -0.8, duration: 9, ease: "none" },
        )
      }
    },
    { scope: heroRef, dependencies: [currentSlide] },
  )

  const handleSuggestionClick = (id: number) => {
    setShowSuggestions(false)
    router.push(`/tour/${id}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("search", searchQuery.trim())
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    const query = params.toString()
    router.push(query ? `/tour?${query}` : "/tour")
  }

  const getImageSrc = (tour: TourSuggestion) => {
    if (tour.featured_image) return tour.featured_image
    if (tour.images && tour.images.length > 0) return tour.images[0].file
    return "/placeholder.svg"
  }

  const headline = ["All", "roads", "lead"]
  const headlineSecondLine = ["to", "extraordinary."]

  return (
    <div ref={heroRef} className="relative w-full z-20">
      {/* Hero card */}
      <div className="px-2 sm:px-3">
        <div className="relative w-full h-[560px] sm:h-[600px] lg:h-[640px] overflow-hidden rounded-3xl">
          {/* Background slides */}
          <div className="absolute inset-0 overflow-hidden">
            {slides.map((slide, index) => (
              <img
                key={slide.image}
                data-hero-image={index}
                src={slide.image}
                alt={slide.alt}
                className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Warm gradient overlays for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/55 to-espresso/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-espresso/35" />
            <AmbientParticles count={180} />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center">
            <p
              data-hero-fade
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gold-light"
            >
              Your Roman story starts here
            </p>

            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-[4.1rem] font-semibold text-white">
              <span className="block">
                {headline.map((word, i) => (
                  <span key={`l1-${i}`}>
                    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                      <span data-hero-word className="inline-block">
                        {word}
                      </span>
                    </span>{" "}
                  </span>
                ))}
              </span>
              <span className="block">
                {headlineSecondLine.map((word, i) => (
                  <span key={`l2-${i}`}>
                    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                      <span data-hero-word className="inline-block">
                        {word}
                      </span>
                    </span>{" "}
                  </span>
                ))}
              </span>
            </h1>

            <p
              data-hero-fade
              className="mt-5 text-base sm:text-lg text-white/85 max-w-md"
            >
              Discover timeless landmarks and unforgettable moments in Rome.
            </p>

            {/* Search bar */}
            <div data-hero-fade className="mt-9 w-full max-w-3xl" ref={wrapperRef}>
              <div className="relative rounded-2xl bg-white shadow-warm-lg p-2">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0">
                  {/* Experience */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5">
                    <Search className="w-5 h-5 text-ink/50 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="hero-search"
                        className="block font-serif text-[15px] font-semibold text-ink leading-tight"
                      >
                        Experience
                      </label>
                      <input
                        id="hero-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowSuggestions(true)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch()
                        }}
                        placeholder="Search tours and landmarks"
                        className="w-full bg-transparent text-sm text-ink placeholder:text-ink/45 focus:outline-none"
                      />
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden lg:block h-11 w-px bg-ink/10 shrink-0"
                  />

                  {/* When */}
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-3 lg:w-[232px] px-4 py-2.5 rounded-xl text-left transition-colors hover:bg-cream/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45"
                      >
                        <CalendarDays className="w-5 h-5 text-ink/50 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-serif text-[15px] font-semibold text-ink leading-tight">
                            When
                          </span>
                          <span className="block truncate text-sm text-ink/55">
                            {date ? format(date, "EEE, d MMM yyyy") : "Choose a date"}
                          </span>
                        </span>
                        <ChevronDown className="w-4 h-4 text-ink/45 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d)
                          setDateOpen(false)
                        }}
                        disabled={{ before: new Date() }}
                        autoFocus
                      />
                      {date && (
                        <div className="border-t p-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDate(undefined)
                              setDateOpen(false)
                            }}
                            className="w-full rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-cream/70 transition-colors"
                          >
                            Clear date
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                  <button
                    onClick={handleSearch}
                    className="btn-premium w-full lg:w-auto shrink-0 px-7 py-3.5 rounded-xl"
                  >
                    Find my experience
                    <ArrowUpRight size={18} />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (isLoading || suggestions.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-1000 max-h-[400px] overflow-y-auto">
                    <div className="p-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-3 border-gray-200 border-t-[#9E2B25] rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-500">Searching...</span>
                          </div>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <>
                          <h3 className="text-sm font-semibold text-gray-500 px-4 py-2">Suggestions</h3>
                          {suggestions.map((tour, index) => (
                            <div
                              key={tour.id}
                              onClick={() => handleSuggestionClick(tour.id)}
                              className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors ${index !== suggestions.length - 1 ? "border-b-2 border-gray-100" : ""
                                }`}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                <img
                                  src={getImageSrc(tour) || "/placeholder.svg"}
                                  alt={tour.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col items-start text-left">
                                <span className="font-medium text-gray-900">{tour.title}</span>
                                <span className="text-sm text-gray-500">
                                  €{tour.price_adult}
                                  {tour.duration ? ` • ${tour.duration}` : ""}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-8 h-8 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">No result found</span>
                            <span className="text-xs text-gray-500">Try a different search term</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-8">
          {trustPoints.map(({ icon: Icon, label }, index) => (
            <div key={label} className="flex items-center gap-4 sm:gap-8">
              {index > 0 && (
                <span aria-hidden="true" className="h-5 w-px bg-ink/15" />
              )}
              <span className="flex items-center gap-2.5 text-sm sm:text-[15px] text-ink/80">
                <Icon size={20} strokeWidth={1.6} className="text-ink/70" />
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
