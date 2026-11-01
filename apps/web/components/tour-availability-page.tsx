"use client"

import { useEffect, useState, useRef } from "react"
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
    Users2,
    Loader2,
    Calendar as CalendarIcon,
    Image as ImageIcon,
    X,
    Car,
    CheckCircle2,
    AlertCircle,
    ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    getTourById, getTourDates, getTourTimeSlots,
    TourDate,
    TourPlan,
    TourTimeSlot,
    addToCart,
    AddToCartPayload
} from "@/services/tourService"
import { useAppDispatch } from "@/lib/hooks"
import { fetchCartCount } from "@/lib/features/cart/cartSlice"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/services/authService"
import { LoginModal } from "@/components/auth/LoginModal"
import { RegisterModal } from "@/components/auth/RegisterModal"
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
    const [currentDate, setCurrentDate] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1) })
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
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 md:p-6 z-50 w-[90vw] max-w-[350px] md:max-w-[700px] md:w-[700px]">
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-[80vw] sm:w-[350px]">
            {/* Changing top-full to bottom-full for this page maybe? Original was top-full. Let's stick to original but ensure z-index */}

            {/* Adult */}
            {tour.max_adults > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Adult <span className="text-gray-600 font-normal text-xs">(Age {tour.adult_age_min}-{tour.adult_age_max})</span>
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onUpdateCount('adults', -1, tour.max_adults)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.adults}</span>
                        <button
                            onClick={() => onUpdateCount('adults', 1, tour.max_adults)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
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
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.children}</span>
                        <button
                            onClick={() => onUpdateCount('children', 1, tour.max_children)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
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
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.infants}</span>
                        <button
                            onClick={() => onUpdateCount('infants', 1, tour.max_infants)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}

            {/* Youth */}
            {(tour as any).max_youth > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Youth <span className="text-gray-600 font-normal text-xs">(Age {(tour as any).youth_age_min}-{(tour as any).youth_age_max})</span>
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onUpdateCount('youths', -1, (tour as any).max_youth)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.youths}</span>
                        <button
                            onClick={() => onUpdateCount('youths', 1, (tour as any).max_youth)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}

            {/* Student UE */}
            {(tour as any).max_student_eu > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Student EU <span className="text-gray-600 font-normal text-xs">(Age {(tour as any).student_eu_age_min}-{(tour as any).student_eu_age_max})</span>
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onUpdateCount('students', -1, (tour as any).max_student_eu)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.students}</span>
                        <button
                            onClick={() => onUpdateCount('students', 1, (tour as any).max_student_eu)}
                            className="p-2 hover:bg-gray-100 rounded-full border border-gray-300"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default function TourAvailabilityPage({ tourId }: { tourId: number }) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [tour, setTour] = useState<TourPlan | null>(null)
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)
    const [isBookingLoading, setIsBookingLoading] = useState(false)
    const [isCartLoading, setIsCartLoading] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    // Message Modal State
    const [messageModalOpen, setMessageModalOpen] = useState(false)
    const [messageModalTitle, setMessageModalTitle] = useState("")
    const [messageModalContent, setMessageModalContent] = useState("")

    const showMessage = (title: string, content: string) => {
        setMessageModalTitle(title)
        setMessageModalContent(content)
        setMessageModalOpen(true)
    }

    // Booking State
    const [selectedDate, setSelectedDate] = useState<TourDate | null>(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TourTimeSlot | null>(null)
    const [timeSlots, setTimeSlots] = useState<TourTimeSlot[]>([])
    const [availableDates, setAvailableDates] = useState<TourDate[]>([])
    const [datesLoading, setDatesLoading] = useState(false)

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
    const travelerPickerRef = useRef<HTMLDivElement>(null)

    // Ref for Grid Date Picker
    const gridDatePickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node
            const isOutsideMain = travelerPickerRef.current && !travelerPickerRef.current.contains(target)

            if (isOutsideMain) {
                setIsTravelerPickerOpen(false)
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

    const [isGridDatePickerOpen, setIsGridDatePickerOpen] = useState(false) // For horizontal strip
    const [showBookingButtons, setShowBookingButtons] = useState(false) // For booking buttons toggle

    // Handlers
    const handleDateSelect = (date: TourDate) => {
        setSelectedDate(date)
        setSelectedTimeSlot(null) // Reset time slot when date changes
        localStorage.removeItem('selectedTimeSlot')
        setIsGridDatePickerOpen(false) // Close grid picker
        // setShowBookingButtons(false) // Keep existing behavior or reset? User didn't specify, best to reset to force flow?
        // User flow: Pick Date -> Pick Travelers -> Check Info -> Select -> Pick Time -> Book
        // If date changes, time slot is gone, so Book button shouldn't work.
        // So resetting showBookingButtons is safer.
        setShowBookingButtons(false)
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
            setIsCartLoading(true)
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
        } finally {
            setIsCartLoading(false)
        }
    }

    const handleBookNow = () => {
        // if (!isLoggedIn()) {
        //     setIsLoginOpen(true)
        //     return
        // }
        if (!tour || !selectedDate || !selectedTimeSlot) {
            showMessage("Missing Selection", "Please select a date and time slot first")
            return
        }
        setIsBookingLoading(true)

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
            if ((tour as any).price_youth) total += counts.youths * Number((tour as any).price_youth)
            if ((tour as any).price_student_eu) total += counts.students * Number((tour as any).price_student_eu)
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

    // Trigger fetchTourDetails when tourId changes
    useEffect(() => {
        if (tourId) {
            fetchTourDetails()
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

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="p-1 hover:bg-gray-100 rounded-full transition -ml-2"
                            aria-label="Go back"
                        >
                            <ChevronLeft size={32} className="text-gray-900" />
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900">Check availability</h2>
                    </div>

                    {/* Check availability logic */}
                    {/* Horizontal Date Selector */}
                    <div className="mb-6 relative flex gap-2">
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide flex-1">
                            {nextDays.map((date, idx) => {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const formattedDate = `${year}-${month}-${day}`;

                                const availableDate = availableDates.find(d => d.date === formattedDate)
                                const isSelected = selectedDate?.date === formattedDate

                                // Check if date is today
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const isToday = date.getTime() === today.getTime()
                                const isPast = date.getTime() < today.getTime()

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (availableDate && !isPast) handleDateSelect(availableDate)
                                        }}
                                        disabled={!availableDate || isPast}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-lg border transition-all
                                        ${isSelected
                                                ? "border-brand bg-cream text-brand-dark"
                                                : availableDate && !isPast
                                                    ? "border-gray-300 bg-white text-gray-900 hover:border-gray-400 cursor-pointer"
                                                    : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <span className="text-xs font-semibold uppercase">
                                            {isToday ? "Today" : date.toLocaleString('default', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-xl font-semibold ${isSelected ? "text-brand-dark" : "text-gray-400"}`}>
                                            {date.getDate()}
                                        </span>
                                        <span className="text-xs">
                                            {date.toLocaleString('default', { month: 'short' })}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Calendar Icon Button */}
                        <div className="relative" ref={gridDatePickerRef}>
                            <button
                                onClick={() => setIsGridDatePickerOpen(!isGridDatePickerOpen)}
                                className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-lg border border-gray-300 bg-white text-gray-900 hover:border-gray-400 cursor-pointer"
                            >
                                <CalendarIcon size={24} />
                            </button>

                            {/* Dropdown DatePicker */}
                            <DatePicker
                                isOpen={isGridDatePickerOpen}
                                onClose={() => setIsGridDatePickerOpen(false)}
                                tourId={tourId}
                                onDateSelect={handleDateSelect}
                            />
                        </div>
                    </div>

                    {/* Time Slot Selector - Only show if date selected AND Select button clicked (showBookingButtons) */}
                    {selectedDate && timeSlots.length > 0 && showBookingButtons && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-[#2A2118] mb-1">Select a starting time</label>
                            <p className="text-sm text-gray-500 mb-3">
                                {new Date(selectedDate.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            <motion.div
                                key={selectedDate.id}
                                className="flex flex-wrap gap-3"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.05 } },
                                }}
                            >
                                {timeSlots.map(slot => {
                                    const isSelected = selectedTimeSlot?.id === slot.id
                                    return (
                                        <motion.button
                                            key={slot.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 8 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                                            }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                            className={`relative px-6 py-2.5 rounded-lg border text-sm font-semibold transition-colors duration-200
                            ${isSelected
                                                    ? "text-white border-[#2A2118]"
                                                    : "bg-white text-[#2A2118] border-gray-400 hover:border-[#2A2118]"
                                                }`}
                                        >
                                            {isSelected && (
                                                <motion.span
                                                    layoutId="time-slot-fill"
                                                    className="absolute inset-0 rounded-[7px] bg-[#2A2118]"
                                                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                                />
                                            )}
                                            <span className="relative z-10">
                                                {slot.start_time.split(':').slice(0, 2).join(':')}
                                            </span>
                                        </motion.button>
                                    )
                                })}
                            </motion.div>
                        </div>
                    )}

                    {/* Tour option card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6"
                    >
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">{tour.title}</h3>

                        <div className="flex flex-wrap gap-6 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-gray-600" />
                                <span className="text-gray-700 font-medium">14 hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-gray-600" />
                                <span className="text-gray-700 font-medium">Guide: English</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between items-stretch gap-8">
                            {/* Left Side: Travelers Selector */}
                            <div className="flex-1">
                                <div className="relative w-full mb-0 md:mb-10" ref={travelerPickerRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsTravelerPickerOpen(!isTravelerPickerOpen)
                                        }}
                                        className="w-full md:w-[350px] flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition text-gray-700 font-medium whitespace-nowrap"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>👥</span>
                                            <span>{getTravelerSummary()}</span>
                                        </span>
                                        <ChevronLeft size={20} className="text-gray-600 rotate-180" />
                                    </button>

                                    <TravelerCounter
                                        isOpen={isTravelerPickerOpen}
                                        onClose={() => setIsTravelerPickerOpen(false)}
                                        tour={tour}
                                        counts={counts}
                                        onUpdateCount={handleUpdateCount}
                                    />
                                </div>
                            </div>

                            {/* Right Side: Price, Booking Buttons, and Cancellation */}
                            <div className="flex-1 flex flex-col items-stretch md:items-end gap-4 text-left md:text-right">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">{getPriceSummary()}</p>
                                    <p className="text-3xl font-semibold text-gray-900">€{calculateTotalPrice()}</p>
                                </div>

                                <div className="w-full sm:w-auto">
                                    {!showBookingButtons ? (
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowBookingButtons(true)}
                                            className="w-full sm:min-w-[160px] bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition"
                                        >
                                            Select
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="flex flex-col sm:flex-row gap-2 w-full"
                                        >
                                            <button
                                                onClick={handleBookNow}
                                                disabled={isBookingLoading}
                                                className="bg-brand text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-dark transition flex items-center justify-center min-w-[120px] w-full cursor-pointer"
                                            >
                                                {isBookingLoading ? (
                                                    <><Loader2 className="animate-spin mr-2 h-4 w-4" />Booking...</>
                                                ) : (
                                                    "Book now"
                                                )}
                                            </button>
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={isCartLoading}
                                                className="bg-brand text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-dark transition flex items-center justify-center min-w-[140px] w-full cursor-pointer"
                                            >
                                                {isCartLoading ? (
                                                    <><Loader2 className="animate-spin mr-2 h-4 w-4" />Adding...</>
                                                ) : (
                                                    "Add to Cart"
                                                )}
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-teal-600 md:justify-end justify-start">
                                    <Check size={18} />
                                    <span className="text-sm font-medium">Free cancellation</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false)
                    setIsRegisterOpen(true)
                }}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false)
                    setIsLoginOpen(true)
                }}
            />


            <AlertDialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
                <AlertDialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    >
                    <div className={`p-6 flex flex-col items-center justify-center border-b ${messageModalTitle === "Success" ? "bg-green-50 border-green-100" :
                        messageModalTitle === "Error" ? "bg-red-50 border-red-100" :
                            "bg-cream border-cream"
                        }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner ${messageModalTitle === "Success" ? "bg-green-100" :
                            messageModalTitle === "Error" ? "bg-red-100" :
                                "bg-cream"
                            }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${messageModalTitle === "Success" ? "bg-green-200" :
                                messageModalTitle === "Error" ? "bg-red-200" :
                                    "bg-cream-dark"
                                }`}>
                                {messageModalTitle === "Success" ? (
                                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                                ) : messageModalTitle === "Error" || messageModalTitle.includes("Failed") || messageModalTitle === "Missing Selection" ? (
                                    <AlertCircle className="text-red-600 w-6 h-6" />
                                ) : (
                                    <ShieldCheck className="text-brand w-6 h-6" />
                                )}
                            </div>
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">{messageModalTitle}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-gray-600 mt-2 max-w-[280px]">
                            {messageModalContent}
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogFooter className="p-6 pt-0 bg-white">
                        <AlertDialogAction
                            onClick={() => setMessageModalOpen(false)}
                            className={`w-full cursor-pointer py-3 h-auto rounded-lg font-semibold text-white shadow-md transition-all ${messageModalTitle === "Success" ? "bg-green-600 hover:bg-green-700 shadow-green-200" :
                                messageModalTitle === "Error" ? "bg-red-600 hover:bg-red-700 shadow-red-200" :
                                    "bg-[#2A2118] hover:bg-[#0a1e5c] shadow-cream-dark"
                                }`}
                        >
                            OK, Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </motion.div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
