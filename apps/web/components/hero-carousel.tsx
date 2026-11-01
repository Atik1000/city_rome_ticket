"use client"

import { useEffect, useState, useRef } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/services/authService";
import AmbientParticles from "@/components/animation/ambient-particles"
import { gsap, useGSAP, prefersReducedMotion } from "@/components/animation/gsap"
interface TourSuggestion {
  id: number
  title: string
  price_adult: number
  duration?: string
  images?: { file: string }[]
  featured_image?: string
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<TourSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const slides = [
    {
      image: "/images/carousel2.jpg",
      kicker: "Skip-the-line tickets & guided tours",
      title: "The Eternal City, Unlocked",
      subtitle: "Colosseum, Vatican, Pantheon...",
    },
    {
      image: "/images/carousel1.jpg",
      kicker: "Local guides · Instant mobile tickets",
      title: "Walk Where Emperors Walked",
      subtitle: "Search tours and experiences",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

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
            // Assuming the API returns { data: [...] } or just [...]
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

  // Ken-Burns drift on the hero image + headline words rising in, restarted per slide
  useGSAP(
    () => {
      if (prefersReducedMotion() || !heroRef.current) return
      const image = heroRef.current.querySelector("[data-hero-image]")
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.12, xPercent: 0.8 },
          { scale: 1.02, xPercent: -0.8, duration: 7, ease: "none" },
        )
      }
      const words = heroRef.current.querySelectorAll("[data-hero-word]")
      if (words.length) {
        gsap.fromTo(
          words,
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", stagger: 0.07 },
        )
      }
      const kicker = heroRef.current.querySelector("[data-hero-kicker]")
      if (kicker) {
        gsap.fromTo(
          kicker,
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", delay: 0.15 },
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
    if (searchQuery.trim()) {
      router.push(`/tour?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getImageSrc = (tour: TourSuggestion) => {
    if (tour.featured_image) return tour.featured_image
    if (tour.images && tour.images.length > 0) return tour.images[0].file
    return "/placeholder.svg"
  }

  return (
    <div ref={heroRef} className="relative w-full h-[440px] sm:h-[560px] z-20">
      {/* Slide */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={currentSlide}
            data-hero-image
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt="Rome landmarks"
            className="w-full h-full object-cover will-change-transform scale-105"
          />
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" />
          {/* Golden dust / ember WebGL layer (decorative) */}
          <AmbientParticles count={220} />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <p
            data-hero-kicker
            className="mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-gold-light"
          >
            {slides[currentSlide].kicker}
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-white mb-6 sm:mb-8 text-balance drop-shadow-sm">
            {slides[currentSlide].title.split(" ").map((word, i) => (
              <span key={`${currentSlide}-${i}`}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                  <span data-hero-word className="inline-block">
                    {word}
                  </span>
                </span>{" "}
              </span>
            ))}
          </h1>

          {/* Search (mobile-friendly) */}
          <div className="w-full max-w-lg lg:max-w-lg md:max-w-lg sm:max-w-sm" ref={wrapperRef}>
            <div className="bg-white/95 backdrop-blur rounded-2xl sm:rounded-full shadow-lg p-2 relative">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-0">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true)
                    }}
                    placeholder={slides[currentSlide].subtitle}
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch()
                    }}
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto bg-[#9E2B25] hover:bg-[#9E2B25]/90 text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 transition rounded-xl sm:rounded-full flex items-center justify-center gap-2"
                >
                  <span>Search</span>
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
                                className="w-full h-full object-fixed"
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
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
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

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition ${index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

