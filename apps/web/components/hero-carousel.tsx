"use client"

import { useEffect, useState, useRef } from "react"
import { Search, CalendarDays, ChevronDown, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { API_BASE_URL } from "@/services/authService";
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

const heroImage = { src: "/images/carousel1.jpg", alt: "Ancient Roman columns" }

export default function HeroCarousel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<TourSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  return (
    <section ref={heroRef} className="relative z-20 w-full">
      <div className="relative min-h-[570px] overflow-hidden sm:min-h-[620px] lg:min-h-[650px]">
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,19,48,.6),rgba(8,27,67,.38)_47%,rgba(5,19,48,.6))]" />
          </div>

          {/* Content */}
          <div className="relative mx-auto flex min-h-[570px] max-w-5xl flex-col items-center justify-center px-5 pb-12 pt-5 text-center sm:min-h-[620px] lg:min-h-[650px]">
            <h1 className="max-w-3xl font-serif text-[2.9rem] font-semibold leading-[.98] tracking-[-.035em] text-white drop-shadow-sm sm:text-6xl lg:text-[4.65rem]">
              Rome is yours<br />to explore.
            </h1>

            <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-white/95 sm:text-xl">
              Book landmark tickets and guided tours with local experts.
            </p>

            {/* Search bar */}
            <div className="mt-9 w-full max-w-3xl text-left" ref={wrapperRef}>
              <div className="relative rounded-xl bg-white p-2 shadow-[0_14px_34px_rgba(0,0,0,.25)] sm:p-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0">
                  {/* Experience */}
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 sm:px-4">
                    <Search className="h-5 w-5 shrink-0 text-[#252525]/70" strokeWidth={1.8} />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="hero-search"
                        className="block text-[13px] font-bold text-[#252525] leading-tight"
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
                    className="hidden h-11 w-px shrink-0 bg-[#252525]/20 lg:block"
                  />

                  {/* When */}
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3063a6]/45 sm:px-4 lg:w-[210px]"
                      >
                        <CalendarDays className="h-5 w-5 shrink-0 text-[#252525]/70" strokeWidth={1.8} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold text-[#252525] leading-tight">
                            Date
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
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3063a6] px-6 py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#193c6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3063a6] lg:w-auto"
                  >
                    Find tours
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (isLoading || suggestions.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-1000 max-h-[400px] overflow-y-auto">
                    <div className="p-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-3 border-gray-200 border-t-brand rounded-full animate-spin"></div>
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
    </section>
  )
}
