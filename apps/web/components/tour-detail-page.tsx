"use client"

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import {
  Heart,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Clock,
  Users,
  Car,
  Users2,
  Loader2,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { ItineraryTimeline } from "./Itinerary-timeline"
import {
  getTourById, getTourDates, getTourTimeSlots,
  TourDate,
  TourPlan,
  TourTimeSlot,
  addToCart,
  AddToCartPayload,
  getRecommendedTours
} from "@/services/tourService"
import { useAppDispatch } from "@/lib/hooks"
import { fetchCartCount } from "@/lib/features/cart/cartSlice"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function DatePicker({
  isOpen,
  onClose,
  tourId,
  onDateSelect
}: {
  isOpen: boolean
  onClose: () => void
  tourId: number
  onDateSelect: (date: TourDate) => void
}) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [availableDates, setAvailableDates] = useState<TourDate[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && tourId) {
      const fetchDates = async () => {
        try {
          setLoading(true)
          const data = await getTourDates(tourId)
          // Store available dates objects
          setAvailableDates(data.results)
        } catch (error) {
          console.error("Failed to fetch tour dates", error)
        } finally {
          setLoading(false)
        }
      }
      fetchDates()
    }
  }, [isOpen, tourId])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = (date: Date) => {
    const daysInMonth = getDaysInMonth(date)
    const firstDay = getFirstDayOfMonth(date)
    const days = []
    const monthName = date.toLocaleString("default", { month: "long", year: "numeric" })

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      // Construct date string YYYY-MM-DD manually to match API format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;

      const isAvailable = availableDates.some(d => d.date === dateString);

      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(year, date.getMonth(), day);
      const isPast = checkDate < today;

      days.push(
        <div
          key={day}
          className={`text-center py-2 text-sm font-medium rounded 
                ${isAvailable && !isPast
              ? "cursor-pointer text-gray-900 hover:bg-cream font-semibold"
              : "text-gray-300 cursor-not-allowed pointer-events-none"}`}
          onClick={() => {
            if (isAvailable && !isPast) {
              const selected = availableDates.find(d => d.date === dateString)
              if (selected) onDateSelect(selected)
            }
          }}
        >
          {day}
        </div>
      )
    }

    return { monthName, days }
  }

  const currentMonth = renderCalendar(currentDate)
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  const nextMonthData = renderCalendar(nextMonth)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gold/30 rounded-xl shadow-warm-lg p-4 md:p-6 z-50 w-[90vw] max-w-[350px] md:max-w-[700px] md:w-[700px]">
      <div className="flex justify-between items-start">
        {/* Left Arrow */}
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded mt-1">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        {/* Months Container */}
        <div className="flex gap-0 md:gap-8 flex-1 justify-center">
          {/* Current Month */}
          <div className="w-64">
            <h3 className="text-center font-semibold text-gray-900 text-base mb-4">{currentMonth.monthName}</h3>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {currentMonth.days}
            </div>
          </div>

          {/* Next Month - Hidden on Mobile */}
          <div className="hidden md:block w-64">
            <h3 className="text-center font-semibold text-gray-900 text-base mb-4">{nextMonthData.monthName}</h3>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={`next-${day}`} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {nextMonthData.days}
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded mt-1">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>


    </div>
  )
}

function TravelerCounter({
  isOpen,
  onClose,
  tour,
  counts,
  onUpdateCount
}: {
  isOpen: boolean
  onClose: () => void
  tour: TourPlan
  counts: any
  onUpdateCount: (key: string, delta: number, max: number) => void
}) {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gold/30 rounded-xl shadow-warm-lg p-4 z-10 w-[90vw] sm:w-[350px]">

      {/* Adult */}
      {tour.max_adults > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Adult <span className="text-gray-600 font-normal text-xs">(Age {tour.adult_age_min}-{tour.adult_age_max})</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdateCount('adults', -1, tour.max_adults)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.adults}</span>
            <button
              onClick={() => onUpdateCount('adults', 1, tour.max_adults)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Child */}
      {tour.max_children > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Child <span className="text-gray-600 font-normal text-xs">(Age {tour.child_age_min}-{tour.child_age_max})</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdateCount('children', -1, tour.max_children)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.children}</span>
            <button
              onClick={() => onUpdateCount('children', 1, tour.max_children)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Infant */}
      {tour.max_infants > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Infant <span className="text-gray-600 font-normal text-xs">(Age {tour.infant_age_min}-{tour.infant_age_max})</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdateCount('infants', -1, tour.max_infants)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.infants}</span>
            <button
              onClick={() => onUpdateCount('infants', 1, tour.max_infants)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Youth */}
      {tour.max_youth > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Youth <span className="text-gray-600 font-normal text-xs">(Age {tour.youth_age_min}-{tour.youth_age_max})</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdateCount('youths', -1, tour.max_youth)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.youths}</span>
            <button
              onClick={() => onUpdateCount('youths', 1, tour.max_youth)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Student UE */}
      {tour.max_student_eu > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Student EU <span className="text-gray-600 font-normal text-xs">(Age {tour.student_eu_age_min}-{tour.student_eu_age_max})</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdateCount('students', -1, tour.max_student_eu)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.students}</span>
            <button
              onClick={() => onUpdateCount('students', 1, tour.max_student_eu)}
              className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

function ReviewCard({
  reviewer,
  location,
  date,
  rating,
  text,
}: { reviewer: string; location: string; date: string; rating: number; text: string }) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase()
  const getAvatarColor = (name: string) => {
    const colors = ["bg-brand", "bg-espresso", "bg-gold", "bg-brand-dark", "bg-laurel"]
    return colors[name.charCodeAt(0) % colors.length]
  }

  return (
    <div className="bg-white border border-gold/25 rounded-2xl p-6 shadow-warm">
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`${getAvatarColor(reviewer)} text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg flex-shrink-0`}
        >
          {getInitial(reviewer)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-gold text-gold" />
            ))}
            <span className="text-sm font-semibold text-gray-900 ml-2">{rating}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {reviewer} – {location}
          </p>
          <p className="text-xs text-gray-600">{date} · Verified booking</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  )
}

export default function TourDetailPage({ tourId }: { tourId: number }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [tour, setTour] = useState<TourPlan | null>(null)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const showMessage = (title: string, content: string) => {
    if (title === "Success") toast.success(content)
    else if (title === "Error" || title.includes("Failed")) toast.error(content)
    else toast.warning(content)
  }

  const [isFavorite, setIsFavorite] = useState(false)

  // Booking State
  const [selectedDate, setSelectedDate] = useState<TourDate | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TourTimeSlot | null>(null)
  const [timeSlots, setTimeSlots] = useState<TourTimeSlot[]>([])
  const [availableDates, setAvailableDates] = useState<TourDate[]>([])
  const [datesLoading, setDatesLoading] = useState(false)
  const [recommendedTours, setRecommendedTours] = useState<TourPlan[]>([])

  const [counts, setCounts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('travelerCounts')
      if (saved) return JSON.parse(saved)
    }
    return {
      adults: 1,
      children: 0,
      infants: 0,
      youths: 0,
      students: 0
    }
  })

  // Load saved state on mount
  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate')
    if (savedDate) setSelectedDate(JSON.parse(savedDate))

    const savedTime = localStorage.getItem('selectedTimeSlot')
    if (savedTime) setSelectedTimeSlot(JSON.parse(savedTime))
  }, [])

  // Save state changes
  useEffect(() => {
    localStorage.setItem('travelerCounts', JSON.stringify(counts))
  }, [counts])

  useEffect(() => {
    if (selectedDate) localStorage.setItem('selectedDate', JSON.stringify(selectedDate))
  }, [selectedDate])

  // Fetch dates when tourId changes
  useEffect(() => {
    if (tourId) {
      const fetchDates = async () => {
        try {
          setDatesLoading(true)
          const data = await getTourDates(tourId)
          setAvailableDates(data.results)
        } catch (error) {
          console.error("Failed to fetch tour dates", error)
        } finally {
          setDatesLoading(false)
        }
      }
      fetchDates()
    }
  }, [tourId])

  useEffect(() => {
    if (selectedTimeSlot) localStorage.setItem('selectedTimeSlot', JSON.stringify(selectedTimeSlot))
  }, [selectedTimeSlot])

  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchTimeSlots = async () => {
        try {
          const data = await getTourTimeSlots(selectedDate.id)
          setTimeSlots(data.results)
        } catch (error) {
          console.error("Failed to fetch time slots", error)
        }
      }
      fetchTimeSlots()
    }
  }, [selectedDate])

  const [isTravelerPickerOpen, setIsTravelerPickerOpen] = useState(false)

  const travelerPickerRefSidebar = useRef<HTMLDivElement>(null)

  const sidebarDatePickerRef = useRef<HTMLDivElement>(null)
  const gridDatePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (travelerPickerRefSidebar.current && !travelerPickerRefSidebar.current.contains(target)) {
        setIsTravelerPickerOpen(false)
      }

      if (sidebarDatePickerRef.current && !sidebarDatePickerRef.current.contains(target)) {
        setIsDatePickerOpen(false)
      }

      if (gridDatePickerRef.current && !gridDatePickerRef.current.contains(target)) {
        setIsGridDatePickerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false) // For sidebar
  const [isGridDatePickerOpen, setIsGridDatePickerOpen] = useState(false) // For horizontal strip
  const [showBookingButtons, setShowBookingButtons] = useState(false) // For booking buttons toggle
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Handlers
  const handleDateSelect = (date: TourDate) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null) // Reset time slot when date changes
    localStorage.removeItem('selectedTimeSlot')
    setIsDatePickerOpen(false) // Close sidebar picker
    setIsGridDatePickerOpen(false) // Close grid picker
    setShowBookingButtons(false) // Reset booking buttons on date change
  }

  const handleTimeSlotSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = parseInt(e.target.value)
    const slot = timeSlots.find(s => s.id === slotId) || null
    setSelectedTimeSlot(slot)
  }

  const handleUpdateCount = (key: string, delta: number, max: number) => {
    setCounts((prev: any) => ({
      ...prev,
      [key]: Math.max(0, Math.min(prev[key] + delta, max))
    }))
  }

  const handleAddToCart = async () => {
    if (!tour || !selectedDate || !selectedTimeSlot) {
      showMessage("Missing Selection", "Please select a date and time slot first")
      return
    }

    try {
      const payload: AddToCartPayload = {
        num_adults: counts.adults,
        num_children: counts.children,
        num_infants: counts.infants,
        num_youth: counts.youths,
        num_student_eu: counts.students,
        tour_plan: tour.id,
        time_slot: selectedTimeSlot.id
      }

      const response = await addToCart(payload)

      // Save ID to local storage (append to list)
      const existingIds = localStorage.getItem('cartItemId')
      let newIds = response.id.toString()
      if (existingIds) {
        newIds = `${existingIds},${response.id}`
      }
      localStorage.setItem('cartItemId', newIds)

      localStorage.removeItem('selectedDate')
      localStorage.removeItem('selectedTimeSlot')
      localStorage.removeItem('travelerCounts')

      // Reset state / UI
      setSelectedDate(null)
      setSelectedTimeSlot(null)
      setCounts({ adults: 1, children: 0, infants: 0, youths: 0, students: 0 })
      setShowBookingButtons(false)

      setShowBookingButtons(false)

      showMessage("Success", "Tour added to cart!")

      // Update Navbar count via Redux
      dispatch(fetchCartCount())

    } catch (error: any) {
      console.error("Add to cart failed", error)
      showMessage("Error", error.message || "Failed to add to cart")
      if (/invalid time slot|invalid tour|does not belong/i.test(error.message || "")) {
        localStorage.removeItem('selectedDate')
        localStorage.removeItem('selectedTimeSlot')
        setSelectedDate(null)
        setSelectedTimeSlot(null)
      }
    }
  }

  const handleBookNow = () => {
    if (!tour || !selectedDate || !selectedTimeSlot) {
      showMessage("Missing Selection", "Please select a date and time slot first")
      return
    }

    const payload = {
      num_adults: counts.adults,
      num_children: counts.children,
      num_infants: counts.infants,
      num_youth: counts.youths,
      num_student_eu: counts.students,
      tour_plan: tour.id,
      time_slot: selectedTimeSlot.id
    }

    // Save to local storage
    localStorage.setItem('bookNowData', JSON.stringify(payload))
    router.push('/checkout')
  }

  // Generate next 14 days for the horizontal strip
  const getNextDays = (days: number) => {
    const result = []
    const today = new Date()
    // Reset time part to ensure correct comparison
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      result.push(date)
    }
    return result
  }

  const nextDays = getNextDays(14)

  // Derived state for display
  const getTravelerSummary = () => {
    const parts = []
    if (counts.adults > 0) parts.push(`Adult x ${counts.adults}`)
    if (counts.children > 0) parts.push(`Child x ${counts.children}`)
    if (counts.infants > 0) parts.push(`Infant x ${counts.infants}`)
    if (counts.youths > 0) parts.push(`Youth x ${counts.youths}`)
    if (counts.students > 0) parts.push(`Student x ${counts.students}`)
    return parts.join(", ") || "Select travelers"
  }

  const getPriceSummary = () => {
    const parts = []
    if (counts.adults > 0) parts.push(`${counts.adults} Adult x €${tour?.price_adult}`)
    if (counts.children > 0) parts.push(`${counts.children} Child x €${tour?.price_child}`)
    // Add others as needed
    return parts.join(", ")
  }

  const calculateTotalPrice = () => {
    let total = 0
    if (tour) {
      total += counts.adults * Number(tour.price_adult)
      total += counts.children * Number(tour.price_child)
      total += counts.infants * Number(tour.price_infant)
      if (tour.price_youth) total += counts.youths * Number(tour.price_youth)
      if (tour.price_student_eu) total += counts.students * Number(tour.price_student_eu)
    }
    return total.toFixed(2)
  }


  const fetchTourDetails = async () => {
    try {
      setLoading(true)
      const data = await getTourById(tourId)
      setTour(data)
    } catch (err: any) {
      setError(err.message || "Failed to load tour details")
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedTours = async () => {
    try {
      const response = await getRecommendedTours(tourId)
      setRecommendedTours(response.results)
    } catch (error) {
      console.error("Failed to load recommended tours", error)
    }
  }

  // Trigger fetchTourDetails when tourId changes
  useEffect(() => {
    if (tourId) {
      fetchTourDetails()
      loadRecommendedTours()
    }
  }, [tourId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{error || "Tour not found"}</h1>
          <Link href="/" className="text-brand hover:underline">
            Back to tours
          </Link>
        </div>
      </div>
    )
  }

  const images = tour.images && tour.images.length > 0
    ? tour.images.map(img => img.file)
    : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"] // Fallback

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Calculate Max Price
  const prices = [
    Number(tour.price_adult),
    Number(tour.price_child),
    Number(tour.price_infant),
    // Add other prices if they exist on the API response even if interface differs slightly
    // Based on user request, check all price fields
    // Note: The interface currently has price_adult, price_child, price_infant. 
    // Accessing dynamic properties safely if they exist in the raw response but likely sticking to interface for type safety is better. 
    // Assuming standard fields from interface for now. To strictly follow "price_youth", "price_student_eu" mentioned in request:
    tour.price_youth ? Number(tour.price_youth) : 0,
    tour.price_student_eu ? Number(tour.price_student_eu) : 0
  ]
  const maxPrice = Math.max(...prices).toFixed(2);


  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Title and Badges */}
        <div className="mb-8">
          <p className="eyebrow mb-3">Rome · Guided experience</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] mb-5 max-w-4xl">{tour.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Top Rated Badge */}
            <div className="inline-flex items-center gap-1.5 bg-espresso border border-gold/50 text-gold-light px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-[0.12em]">
              <Star size={12} className="fill-current" />
              Top rated
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">• Activity provider: {tour.duration_days} day(s)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-cream/70 rounded-lg transition-colors cursor-pointer">
                <Share2 size={18} className="text-ink/60" />
                <span className="text-ink/80 text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="gold-rule" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery - Grid Layout */}
            <div className="relative mb-8 rounded-2xl overflow-hidden grid grid-cols-3 gap-2 h-100 shadow-warm-md ring-1 ring-gold/20">
              {/* Main large image on the left */}
              <div className="col-span-2 rounded-lg overflow-auto cursor-pointer" onClick={() => openLightbox(0)}>
                <img
                  src={images[0]}
                  alt={`${tour.title} - Main image`}
                  className="w-full h-full object-fixed"
                />
              </div>

              {/* Right column with smaller images */}
              <div className="flex flex-col gap-2">
                {/* First thumbnail */}
                <div className="flex-1 rounded-lg overflow-auto cursor-pointer" onClick={() => openLightbox(0)}>
                  {images[1] && (
                    <img
                      src={images[1]}
                      alt={`${tour.title} - Image 2`}
                      className="w-full h-full object-fixed"
                    />
                  )}
                </div>

                {/* Second thumbnail with +4 badge */}
                <div className="flex-1 rounded-lg overflow-auto relative cursor-pointer" onClick={() => openLightbox(2)}>
                  {images[2] && (
                    <img
                      src={images[2]}
                      alt={`${tour.title} - Image 3`}
                      className="w-full h-full object-fixed"
                    />
                  )}
                  {/* + badge indicator */}
                  {images.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openLightbox(0)
                      }}
                      className="absolute bottom-5 right-5 bg-transparent backdrop-blur-[2px] border-[1.5px] border-white text-white px-5 py-3 rounded-full flex items-center gap-2.5 z-10 hover:backdrop-blur-[3px] transition-all cursor-pointer"
                    >
                      <ImageIcon size={22} strokeWidth={2.5} />
                      <span className="font-semibold text-xl leading-none">+{images.length - 3}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <p className="text-ink/75 text-base leading-relaxed max-w-[68ch]">{tour.description}</p>
            </div>

            {/* About this activity */}
            <div className="mb-12">
              <p className="eyebrow mb-2">The experience</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-6">About this activity</h2>

              {/* Activity Features */}
              {/* <div className="space-y-4 mb-8">
                {tour.free_cancellation && (
                  <div className="flex items-start gap-4">
                    <Check size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Free cancellation</p>
                      <p className="text-gray-600 text-sm">Cancel up to 24 hours in advance for a full refund</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <Share2 size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Reserve now & pay later</p>
                    <p className="text-gray-600 text-sm">
                      Keep your travel plans flexible — book your spot and pay nothing today.
                    </p>
                  </div>
                </div>

                {tour.duration_days && (
                  <div className="flex items-start gap-4">
                    <Clock size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Duration {tour.duration_days} day(s)</p>
                      <p className="text-gray-600 text-sm">Check availability to see starting times</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <Users size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Live tour guide</p>
                    <p className="text-gray-600 text-sm">English</p>
                  </div>
                </div>

                {tour.pickup_included && (
                  <div className="flex items-start gap-4">
                    <Car size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Pickup included</p>
                      <p className="text-gray-600 text-sm">
                        Pickup from your hotel is included. Check details for more info.
                      </p>
                    </div>
                  </div>
                )}
              </div> */}

              <div className="mb-12">
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <ItineraryTimeline locations={tour?.locations || []} />
                </div>
              </div>


              {/* Highlights & Full Description */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-1 gap-8">
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="rounded-2xl border border-gold/25 bg-cream/50 p-6 sm:p-8">
                    <h2 className="font-serif text-2xl font-semibold text-ink mb-5">Highlights</h2>
                    <ul className="space-y-3">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex gap-3 items-baseline">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                          <span className="text-ink/80 text-sm leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h2 className="font-serif text-2xl font-semibold text-ink mb-4">Full description</h2>
                  <div className="text-ink/75 text-sm leading-relaxed mb-3 whitespace-pre-wrap max-w-[68ch]">
                    {tour.full_description || tour.description}
                  </div>
                </div>
              </div>

              {/* Includes & Excludes */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.includes && tour.includes.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Includes</h2>
                    <ul className="space-y-3">
                      {tour.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check size={20} className="text-laurel flex-shrink-0 mt-0.5" />
                          <span className="text-ink/75 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excludes */}
                {tour.excludes && tour.excludes.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Excludes</h2>
                    <ul className="space-y-3">
                      {tour.excludes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-brand font-semibold text-sm">✕</span>
                          <span className="text-ink/75 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Important Information */}
              <div className="mb-12 rounded-2xl border border-gold/20 bg-white p-6 sm:p-8 shadow-warm">
                <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Important information</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                  <div className="space-y-6">
                    {tour.not_suitable_for && tour.not_suitable_for.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-ink mb-3">Not suitable for</h3>
                        <ul className="space-y-2 text-ink/75 text-sm leading-relaxed">
                          {tour.not_suitable_for.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tour.not_allowed && tour.not_allowed.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-ink mb-3">Not allowed</h3>
                        <ul className="space-y-2 text-ink/75 text-sm leading-relaxed">
                          {tour.not_allowed.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    {tour.know_before_you_go && tour.know_before_you_go.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-ink mb-3">Know before you go</h3>
                        <ul className="space-y-2 text-ink/75 text-sm leading-relaxed">
                          {tour.know_before_you_go.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gold/30 rounded-2xl p-6 sticky top-24 shadow-warm-lg overflow-hidden">
              {/* Gold hairline across the top, like a fine receipt */}
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

              {/* Price */}
              <div className="mb-6 pb-5 border-b border-dashed border-gold/30">
                <p className="eyebrow mb-2">Reserve your visit</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-semibold text-ink">€{maxPrice}</span>
                  <span className="text-muted-foreground text-sm">max per person</span>
                </div>
              </div>

              {/* Travelers Selector */}
              <div className="mb-4 relative" ref={travelerPickerRefSidebar}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsTravelerPickerOpen(!isTravelerPickerOpen)
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-ink/15 rounded-xl hover:border-gold/60 hover:bg-cream/30 transition-colors text-ink/80 font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Users size={18} className="text-gold" />
                    <span>{getTravelerSummary()}</span>
                  </span>
                  <ChevronLeft size={20} className="text-ink/50 rotate-180" />
                </button>
                <TravelerCounter
                  isOpen={isTravelerPickerOpen}
                  onClose={() => setIsTravelerPickerOpen(false)}
                  tour={tour}
                  counts={counts}
                  onUpdateCount={handleUpdateCount}
                />
              </div>

              {/* Date Selector */}
              <div className="mb-6 relative" ref={sidebarDatePickerRef}>
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-ink/15 rounded-xl hover:border-gold/60 hover:bg-cream/30 transition-colors text-ink/80 font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <CalendarIcon size={18} className="text-gold" />
                    <span>
                      {selectedDate
                        ? new Date(selectedDate.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        : "Select date"
                      }
                    </span>
                  </span>
                  <ChevronLeft size={20} className="text-ink/50 rotate-180" />
                </button>
                <DatePicker
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  tourId={tour.id}
                  onDateSelect={(date) => {
                    handleDateSelect(date)
                    setIsDatePickerOpen(false)
                  }}
                />
              </div>

              {/* Benefits */}
              <div className="space-y-3 border-t border-dashed border-gold/30 pt-4 mb-5">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-laurel flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free cancellation</p>
                    <p className="text-gray-600 text-xs">Cancel up to 24 hours in advance for a full refund</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-laurel flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Reserve now & pay later</p>
                    <p className="text-gray-600 text-xs">
                      Keep your travel plans flexible — book your spot and pay nothing today.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/tour/${tour.id}/availability`}
                className="btn-premium w-full px-4 py-3.5 text-center"
              >
                Check availability
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No payment taken at this step
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pb-12">
          <p className="eyebrow mb-2">Keep exploring</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-8">You might also like…</h2>

          {/* Carousel Container */}
          <div className="relative">
            <style>{`
                #related-tours-carousel::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            <div
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              id="related-tours-carousel"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {recommendedTours.map((recTour) => (
                <div key={recTour.id} className="flex-shrink-0 w-80">
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gold/20 shadow-warm hover:shadow-warm-lg hover:border-gold/40 transition-[box-shadow,border-color] duration-300 cursor-pointer h-full flex flex-col">
                    <Link href={`/tour/${recTour.id}`} className="block h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={recTour.images && recTour.images.length > 0 ? recTour.images[0].file : "/placeholder.jpg"}
                          alt={recTour.title}
                          className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
                      </div>


                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-[11px] font-semibold text-gold uppercase tracking-[0.2em] mb-2">{recTour.status === 'ACTIVE' ? 'Active tour' : 'Tour'}</div>
                        <h3 className="font-serif text-lg font-semibold leading-snug text-ink mb-2 group-hover:text-brand transition-colors">
                          {recTour.title}
                        </h3>

                        {/* Description used as details for now or truncated */}
                        <div className="text-xs text-muted-foreground mb-3 mt-2 space-y-1 line-clamp-2 leading-relaxed">
                          <p>{recTour.description}</p>
                        </div>

                        <div className="mt-auto pt-3 border-t border-dashed border-gold/30">
                          <div className="flex items-baseline gap-2">
                            <span className="text-muted-foreground text-xs">From</span>
                            <span className="font-serif text-brand font-semibold text-lg">€{recTour.price_adult}</span>
                            <span className="text-muted-foreground text-xs">/ person</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recommendedTours.length > 3 && (
              <>
                <button
                  onClick={() => {
                    const carousel = document.getElementById("related-tours-carousel")
                    if (carousel) {
                      carousel.scrollLeft -= 400
                    }
                  }}
                  className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white border border-gold/30 rounded-full p-3 shadow-warm-md hover:shadow-warm-lg transition text-brand hover:bg-cream z-10 cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right Scroll Arrow */}
                <button
                  onClick={() => {
                    const carousel = document.getElementById("related-tours-carousel")
                    if (carousel) {
                      carousel.scrollLeft += 400
                    }
                  }}
                  className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white border border-gold/30 rounded-full p-3 shadow-warm-md hover:shadow-warm-lg transition text-brand hover:bg-cream z-10 cursor-pointer"
                >
                  <ChevronLeft size={24} className="rotate-180" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          {/* Image Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xl font-semibold z-50 tracking-wide">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
          >
            <X size={32} />
          </button>

          {/* Previous Image - Only show if more than 1 image */}
          {images.length > 1 && (
            <button
              onClick={prevLightboxImage}
              className="absolute left-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              className="max-w-full max-h-screen object-contain select-none"
            />
          </div>

          {/* Next Image - Only show if more than 1 image */}
          {images.length > 1 && (
            <button
              onClick={nextLightboxImage}
              className="absolute right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
