"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { getTourPlans, TourPlan } from "@/services/tourService"
import TourCard from "@/components/tour-card"
import { ChevronDown, X, Search, Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { API_BASE_URL } from "@/services/authService"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function ToursContent() {
    const [tours, setTours] = useState<TourPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const wrapperRef = useRef<HTMLDivElement>(null)
    // Search and filter states
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialSearch = searchParams.get('search') || ""
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const [durationFilter, setDurationFilter] = useState<string | null>(null)
    const [priceFilter, setPriceFilter] = useState<string | null>(null)

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true)

                const params: any = { page }
                if (initialSearch) params.search = initialSearch

                // Apply Duration Filter
                if (durationFilter === "0-3") {
                    params.duration_days_min = 0;
                    params.duration_days_max = 3;
                } else if (durationFilter === "4-6") {
                    // Logic says 4-6 based on user request "4-6 passes 4 and 6"
                    params.duration_days_min = 4;
                    params.duration_days_max = 6;
                } else if (durationFilter === "7+") {
                    params.duration_days_min = 7;
                }

                // Apply Price Filter
                if (priceFilter === "500") {
                    params.price_adult_min = 500;
                    params.price_adult_max = 500;
                } else if (priceFilter === "1000") {
                    params.price_adult_min = 1000;
                    params.price_adult_max = 1000;
                } else if (priceFilter === "1500+") {
                    params.price_adult_min = 1500;
                }

                const response = await getTourPlans(params)
                setTours(response.results)
            } catch (err) {
                setError("Failed to load tours")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTours()
    }, [page, durationFilter, priceFilter, initialSearch])

    // Sync search query state with URL parameter
    useEffect(() => {
        setSearchQuery(initialSearch)
    }, [initialSearch])

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

    const handleDurationChange = (value: string) => {
        setDurationFilter(value === durationFilter ? null : value)
        setPage(1)
    }

    const clearDurationFilter = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDurationFilter(null)
        setPage(1)
    }

    const handlePriceChange = (value: string) => {
        setPriceFilter(value === priceFilter ? null : value)
        setPage(1)
    }

    const clearPriceFilter = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPriceFilter(null)
        setPage(1)
    }

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/tour?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            router.push('/tour')
        }
        setShowSuggestions(false)
    }

    const handleReset = () => {
        setSearchQuery("")
        router.push('/tour')
        setShowSuggestions(false)
    }

    // Sugesstions logic (reused from hero-carousel)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 0
                //&& searchQuery !== initialSearch
            ) {
                setIsSearching(true)
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
                    setIsSearching(false)
                }
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, initialSearch])

    return (
        <div className="min-h-screen bg-background pb-0">
            <Navbar />
            {/* Header Section */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 md:py-8 border-b border-gray-100 mb-8">
                    <div>
                        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2A2118] mb-3">
                            {initialSearch ? "Search Results" : "Tours & Tickets in Rome"}
                        </h1>
                        {!initialSearch && (
                            <p className="text-gray-600 text-lg">
                                Skip-the-line entry, expert guides, instant tickets — choose your next adventure.
                            </p>
                        )}
                    </div>

                    {/* Search field on the right */}
                    <div className="w-full max-w-md relative" ref={wrapperRef}>
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-1">
                            <div className="grid grid-cols-[auto_1fr_auto] items-center">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-cream rounded-lg transition-colors cursor-pointer"
                                >
                                    Reset
                                </button>
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => {
                                            if (suggestions.length > 0) setShowSuggestions(true)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSearch()
                                        }}
                                        placeholder="Search tours..."
                                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                                    />
                                </div>

                                <button
                                    onClick={handleSearch}
                                    className="bg-[#9E2B25] hover:bg-[#9E2B25]/90 text-white font-semibold px-6 py-2 transition rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                                >
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (isSearching || suggestions.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[110] max-h-[300px] overflow-y-auto">
                                {isSearching ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="w-6 h-6 animate-spin text-brand" />
                                    </div>
                                ) : suggestions.length === 0 ? (
                                    <div className="flex items-center justify-center py-6">
                                        <span className="text-sm font-medium text-gray-600">No result found</span>
                                        <span className="text-xs text-gray-500">Try a different search term</span>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        <h3 className="text-sm font-semibold text-gray-500 px-4 py-2">Suggestions</h3>
                                        {suggestions.map((tour) => (
                                            <div
                                                key={tour.id}
                                                onClick={() => {
                                                    router.push(`/tour/${tour.id}`)
                                                    setShowSuggestions(false)
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                                                    <img
                                                        src={(tour.featured_image || (tour.images && tour.images[0]?.file) || "/placeholder.svg")}
                                                        alt={tour.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-medium text-sm text-gray-900">{tour.title}</span>
                                                    <span className="text-xs text-gray-500">€{tour.price_adult}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Select
                        value={durationFilter || ""}
                        onValueChange={handleDurationChange}
                    >
                        <SelectTrigger className={`w-fit rounded-full text-xs font-medium border shadow-none ${durationFilter ? 'bg-cream border-brand text-brand-dark [&>svg:last-child]:hidden' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-2 mr-1">
                                <SelectValue placeholder="Any Duration" />
                            </div>
                            {durationFilter && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        clearDurationFilter(e)
                                    }}
                                    className="hover:bg-cream-dark rounded-full p-0.5 cursor-pointer pointer-events-auto z-10"
                                >
                                    <X size={14} />
                                </div>
                            )}
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="0-3">0-3 hours</SelectItem>
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="4-6">4-6 hours</SelectItem>
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="7+">7+ Hours</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={priceFilter || ""}
                        onValueChange={handlePriceChange}
                    >
                        <SelectTrigger className={`w-fit rounded-full text-xs font-medium border shadow-none ${priceFilter ? 'bg-cream border-brand text-brand-dark [&>svg:last-child]:hidden' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-2 mr-1">
                                <SelectValue placeholder="Any Price" />
                            </div>
                            {priceFilter && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        clearPriceFilter(e)
                                    }}
                                    className="hover:bg-cream-dark rounded-full p-0.5 cursor-pointer pointer-events-auto z-10"
                                >
                                    <X size={14} />
                                </div>
                            )}
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="500">€500</SelectItem>
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="1000">€1000</SelectItem>
                            <SelectItem className="cursor-pointer hover:bg-gray-50" value="1500+">€1500+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tour Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 text-brand border-b-2 border-brand"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && tours.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-2xl font-serif">No tours found.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default function ToursPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-brand" size={40} />
                </div>
            </div>
        }>
            <ToursContent />
        </Suspense>
    )
}
