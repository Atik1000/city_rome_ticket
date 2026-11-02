"use client"

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
    getCart,
    getTourById,
    getTourDates,
    getTourTimeSlots,
    updateCartItem,
    getCartItem,
    deleteCartItem,
    CartItem,
    TourPlan,
    TourDate,
    TourTimeSlot,
    AddToCartPayload
} from "@/services/tourService"
import { isLoggedIn } from "@/services/authService"
import { motion, AnimatePresence } from "framer-motion"
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
import {
    Loader2,
    Trash2,
    Edit2,
    Users,
    ShieldCheck,
    CreditCard,
    Headphones,
    Check,
    ChevronLeft,
    Minus,
    Plus,
    Calendar as CalendarIcon,
    ChevronRight,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- Components Copied from tour-detail-page/tour-availability-page ---

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
            days.push(<div key={`empty-i}`} className="text-center py-2"></div>)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            // Construct date string YYYY-MM-DD manually to match API format
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateString = `${year}-${month}-${dayStr}`;

            const isAvailable = availableDates.some(d => d.date === dateString);

            days.push(
                <div
                    key={day}
                    className={`text-center py-2 text-sm font-medium rounded 
                    ${isAvailable
                            ? "cursor-pointer text-gray-900 hover:bg-cream font-semibold"
                            : "text-gray-300 cursor-not-allowed pointer-events-none"}`}
                    onClick={() => {
                        if (isAvailable) {
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
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gold/30 rounded-xl shadow-warm-lg p-6 z-10 w-[700px]">
            <div className="flex justify-between items-start">
                {/* Left Arrow */}
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded mt-1">
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>

                {/* Months Container */}
                <div className="flex gap-8 flex-1 justify-center">
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

                    {/* Next Month */}
                    <div className="w-64">
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gold/30 rounded-xl shadow-warm-lg p-4 z-100 w-[350px]">

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
            {(tour as any).max_youth > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Youth <span className="text-gray-600 font-normal text-xs">(Age {(tour as any).youth_age_min}-{(tour as any).youth_age_max})</span>
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onUpdateCount('youths', -1, (tour as any).max_youth)}
                            className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.youths}</span>
                        <button
                            onClick={() => onUpdateCount('youths', 1, (tour as any).max_youth)}
                            className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
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
                            className="p-2 hover:bg-cream rounded-full border border-ink/20 transition-colors cursor-pointer"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-6 text-center">{counts.students}</span>
                        <button
                            onClick={() => onUpdateCount('students', 1, (tour as any).max_student_eu)}
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

// --- End Copied Components ---

interface EnhancedCartItem extends CartItem {
    tour?: TourPlan
    dateString?: string
    timeString?: string
    formattedPrice?: string
}

export default function CartPage() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<EnhancedCartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [subtotal, setSubtotal] = useState(0)
    const [isUpdating, setIsUpdating] = useState(false)

    // Edit State
    const [editingItemId, setEditingItemId] = useState<number | null>(null)
    const [loadingEditItemId, setLoadingEditItemId] = useState<number | null>(null)
    const [editCounts, setEditCounts] = useState({
        adults: 0,
        children: 0,
        infants: 0,
        youths: 0,
        students: 0
    })
    const [editSelectedDate, setEditSelectedDate] = useState<TourDate | null>(null)
    const [editSelectedTimeSlot, setEditSelectedTimeSlot] = useState<TourTimeSlot | null>(null)
    const [editTimeSlots, setEditTimeSlots] = useState<TourTimeSlot[]>([])
    const [isEditTravelerPickerOpen, setIsEditTravelerPickerOpen] = useState(false)
    const [isEditDatePickerOpen, setIsEditDatePickerOpen] = useState(false)
    const [editShowBookingButtons, setEditShowBookingButtons] = useState(true) // Default true for edit since we want to show times? Or logic applies?


    const travelerPickerRefSidebar = useRef<HTMLDivElement>(null)
    const sidebarDatePickerRef = useRef<HTMLDivElement>(null)

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const showMessage = (title: string, content: string) => {
        if (title === "Success") toast.success(content)
        else if (title === "Error" || title.includes("Failed")) toast.error(content)
        else toast.warning(content)
    }

    useEffect(() => {
        loadCart()
    }, [])

    // Click outside for edit popovers
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node
            if (travelerPickerRefSidebar.current && !travelerPickerRefSidebar.current.contains(target)) {
                setIsEditTravelerPickerOpen(false)
            }
            if (sidebarDatePickerRef.current && !sidebarDatePickerRef.current.contains(target)) {
                setIsEditDatePickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const loadCart = async () => {
        try {
            setLoading(true)
            const cartIdsStr = localStorage.getItem('cartItemId')
            if (!cartIdsStr) {
                setCartItems([])
                setLoading(false)
                return
            }

            const ids = cartIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n))
            if (ids.length === 0) {
                setCartItems([])
                setLoading(false)
                return
            }

            const cartResponse = await getCart(ids)

            // Enrich items with tour details
            const enrichedItems = await Promise.all(cartResponse.results.map(async (item) => {
                try {
                    // Fetch Tour Details
                    const tour = await getTourById(item.tour_plan)

                    // Resolve Date and Time
                    let dateStr = ""
                    let timeStr = ""

                    const dates = await getTourDates(tour.id)
                    let foundDate = null
                    let foundSlot = null

                    for (const d of dates.results) {
                        const slots = await getTourTimeSlots(d.id)
                        const match = slots.results.find(s => s.id === item.time_slot)
                        if (match) {
                            foundSlot = match
                            foundDate = d
                            break
                        }
                    }

                    if (foundDate && foundSlot) {
                        const dateObj = new Date(foundDate.date)
                        dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                        const [hours, minutes] = foundSlot.start_time.split(':')
                        const h = parseInt(hours, 10)
                        const ampm = h >= 12 ? 'PM' : 'AM'
                        const h12 = h % 12 || 12
                        timeStr = `${h12}:${minutes} ${ampm}`
                    }

                    return {
                        ...item,
                        tour,
                        dateString: dateStr,
                        timeString: timeStr,
                        formattedPrice: item.item_price
                    }
                } catch (err) {
                    console.error("Failed to enrich item", item.id, err)
                    return item
                }
            }))

            setCartItems(enrichedItems)
            const total = enrichedItems.reduce((acc, item) => acc + parseFloat(item.item_price), 0)
            setSubtotal(total)

        } catch (error) {
            console.error("Failed to load cart", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = async (item: EnhancedCartItem) => {
        setEditingItemId(item.id)
        setLoadingEditItemId(item.id)

        // Fetch fresh data for edit
        try {
            const freshItem = await getCartItem(item.id)

            setEditCounts({
                adults: freshItem.num_adults,
                children: freshItem.num_children,
                infants: freshItem.num_infants,
                youths: freshItem.num_youth,
                students: freshItem.num_student_eu
            })

            // We need to resolve the Date object and TimeSlot object for the picker
            // We can reuse the logic from loadCart or just do it freshly here
            if (item.tour) {
                const dates = await getTourDates(item.tour.id)
                let foundDate = null
                let foundSlot = null

                for (const d of dates.results) {
                    const slots = await getTourTimeSlots(d.id)
                    const match = slots.results.find(s => s.id === freshItem.time_slot)
                    if (match) {
                        foundSlot = match
                        foundDate = d
                        setEditTimeSlots(slots.results) // Set available slots for that date
                        break
                    }
                }
                setEditSelectedDate(foundDate)
                setEditSelectedTimeSlot(foundSlot)
            }

            // Allow showing booking buttons (time slots) immediately since we have data
            setEditShowBookingButtons(true)

        } catch (error) {
            console.error("Failed to fetch fresh item for edit", error)
            // Fallback to current item data if fetch fails?
        } finally {
            setLoadingEditItemId(null)
        }
    }

    const handleEditDateSelect = async (date: TourDate) => {
        setEditSelectedDate(date)
        setEditSelectedTimeSlot(null) // Reset time slot
        try {
            const data = await getTourTimeSlots(date.id)
            setEditTimeSlots(data.results)
        } catch (error) {
            console.error("Failed to fetch time slots", error)
        }
        setIsEditDatePickerOpen(false)
        // Ensure buttons/slots are visible
        setEditShowBookingButtons(true)
    }

    const handleCancelEdit = () => {
        setEditingItemId(null)
        setEditCounts({ adults: 0, children: 0, infants: 0, youths: 0, students: 0 })
        setEditSelectedDate(null)
        setEditSelectedTimeSlot(null)
        setEditTimeSlots([])
    }

    const handleUpdateItem = async (itemId: number, tourId: number) => {
        if (!editSelectedDate || !editSelectedTimeSlot) {
            showMessage("Missing Selection", "Please select date and time")
            return
        }

        try {
            setIsUpdating(true)
            const payload: Partial<AddToCartPayload> = {
                num_adults: editCounts.adults,
                num_children: editCounts.children,
                num_infants: editCounts.infants,
                num_youth: editCounts.youths,
                num_student_eu: editCounts.students,
                tour_plan: tourId,
                time_slot: editSelectedTimeSlot.id
            }

            await updateCartItem(itemId, payload)
            showMessage("Success", "Cart item updated!")
            handleCancelEdit()
            loadCart() // Reload to refresh view
        } catch (error: any) {
            console.error("Update failed", error)
            showMessage("Error", error.message || "Failed to update item")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = (idToRemove: number) => {
        setItemToDeleteId(idToRemove)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!itemToDeleteId) return

        try {
            setIsDeleting(true)
            await deleteCartItem(itemToDeleteId)

            // Update local storage
            const cartIdsStr = localStorage.getItem('cartItemId')
            if (cartIdsStr) {
                const ids = cartIdsStr.split(',').filter(id => parseInt(id.trim()) !== itemToDeleteId)
                if (ids.length > 0) {
                    localStorage.setItem('cartItemId', ids.join(','))
                } else {
                    localStorage.removeItem('cartItemId')
                }
            }

            // Reload cart
            loadCart()

            // Close modal
            setIsDeleteModalOpen(false)
            setItemToDeleteId(null)

        } catch (error) {
            console.error("Failed to delete item", error)
            showMessage("Error", "Failed to delete item")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUpdateCount = (key: string, delta: number, max: number) => {
        setEditCounts((prev: any) => ({
            ...prev,
            [key]: Math.max(0, Math.min(prev[key] + delta, max))
        }))
    }

    const getTravelerSummary = () => {
        const parts = []
        if (editCounts.adults > 0) parts.push(`Adult x ${editCounts.adults}`)
        if (editCounts.children > 0) parts.push(`Child x ${editCounts.children}`)
        if (editCounts.infants > 0) parts.push(`Infant x ${editCounts.infants}`)
        if (editCounts.youths > 0) parts.push(`Youth x ${editCounts.youths}`)
        if (editCounts.students > 0) parts.push(`Student x ${editCounts.students}`)
        return parts.join(", ") || "Select travelers"
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="animate-spin text-brand-dark" size={40} />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <p className="eyebrow mb-2">Almost there</p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink mb-3">Your Cart</h1>
                <div aria-hidden="true" className="gold-rule mb-8" />

                {cartItems.length === 0 ? (
                    <div className="card-premium p-10 sm:p-14 text-center">
                        <p className="font-serif text-2xl text-ink mb-2">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground mb-6">The Eternal City is waiting — pick a tour to get started.</p>
                        <a href="/tour" className="btn-premium px-8 py-3 inline-flex">Browse tours</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence initial={false}>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <div className="bg-white border border-gold/25 rounded-2xl shadow-warm hover:shadow-warm-md transition-shadow p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-cream rounded-xl overflow-hidden ring-1 ring-gold/20">
                                            {item.tour?.images && item.tour.images.length > 0 ? (
                                                <img
                                                    src={item.tour.images[0].file}
                                                    alt={item.tour.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Img
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink line-clamp-2">
                                                    {item.tour?.title || "Tour Title"}
                                                </h3>
                                            </div>

                                            {/* Date/Time (View Mode) */}
                                            {editingItemId !== item.id && (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm text-[#2A2118] font-medium mb-1">
                                                        <span>{item.dateString ? `${item.dateString} • ${item.timeString}` : "Date & Time not available"}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                        <span>
                                                            {[
                                                                item.num_adults > 0 ? `${item.num_adults} adult${item.num_adults > 1 ? 's' : ''}` : '',
                                                                item.num_children > 0 ? `${item.num_children} child${item.num_children > 1 ? 'ren' : ''}` : '',
                                                                item.num_infants > 0 ? `${item.num_infants} infant${item.num_infants > 1 ? 's' : ''}` : ''
                                                            ].filter(Boolean).join(', ')}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {/* Free Cancellation */}
                                            <div className="flex items-center gap-2 text-sm text-laurel font-medium mb-4">
                                                <Check size={16} className="stroke-2" />
                                                <span>Free cancellation</span>
                                            </div>

                                            {/* EDIT FORM (Show if editing) */}
                                            {editingItemId === item.id && item.tour && (
                                                <div className="mb-4 space-y-4">
                                                    {loadingEditItemId === item.id ? (
                                                        <div className="flex justify-center p-8">
                                                            <Loader2 className="animate-spin text-brand-dark" size={32} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Travelers Selector */}
                                                            <div className="mb-4 relative" ref={travelerPickerRefSidebar}>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setIsEditTravelerPickerOpen(!isEditTravelerPickerOpen)
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
                                                                    isOpen={isEditTravelerPickerOpen}
                                                                    onClose={() => setIsEditTravelerPickerOpen(false)}
                                                                    tour={item.tour}
                                                                    counts={editCounts}
                                                                    onUpdateCount={handleUpdateCount}
                                                                />
                                                            </div>

                                                            {/* Date Selector */}
                                                            <div className="mb-6 relative" ref={sidebarDatePickerRef}>
                                                                <button
                                                                    onClick={() => setIsEditDatePickerOpen(!isEditDatePickerOpen)}
                                                                    className="w-full flex items-center justify-between px-4 py-3 border border-ink/15 rounded-xl hover:border-gold/60 hover:bg-cream/30 transition-colors text-ink/80 font-medium cursor-pointer"
                                                                >
                                                                    <span className="flex items-center gap-2.5">
                                                                        <CalendarIcon size={18} className="text-gold" />
                                                                        <span>
                                                                            {editSelectedDate
                                                                                ? new Date(editSelectedDate.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                                : "Select date"
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    <ChevronLeft size={20} className="text-ink/50 rotate-180" />
                                                                </button>
                                                                <DatePicker
                                                                    isOpen={isEditDatePickerOpen}
                                                                    onClose={() => setIsEditDatePickerOpen(false)}
                                                                    tourId={item.tour.id}
                                                                    onDateSelect={handleEditDateSelect}
                                                                />
                                                            </div>

                                                            {/* Time Slot Selector */}
                                                            {editSelectedDate && editTimeSlots.length > 0 && editShowBookingButtons && (
                                                                <div className="mb-6">
                                                                    <label className="block font-serif text-base font-semibold text-ink mb-1">Select a starting time</label>
                                                                    <p className="text-sm text-muted-foreground mb-3">
                                                                        {new Date(editSelectedDate.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {editTimeSlots.map(slot => {
                                                                            const isSelected = editSelectedTimeSlot?.id === slot.id
                                                                            return (
                                                                                <button
                                                                                    key={slot.id}
                                                                                    onClick={() => setEditSelectedTimeSlot(slot)}
                                                                                    className={`px-6 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                                                            ${isSelected
                                                                                            ? "bg-espresso text-gold-light border-gold/70 shadow-warm-md"
                                                                                            : "bg-white text-ink border-ink/25 hover:border-gold/70 hover:bg-cream/40"
                                                                                        }`}
                                                                                >
                                                                                    {slot.start_time.split(':').slice(0, 2).join(':')}
                                                                                </button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Update/Cancel Buttons */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleUpdateItem(item.id, item.tour!.id)}
                                                                    disabled={isUpdating}
                                                                    className="btn-premium px-5 py-2 text-sm min-w-[100px]"
                                                                >
                                                                    {isUpdating ? (
                                                                        <>
                                                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                                            Updating...
                                                                        </>
                                                                    ) : (
                                                                        "Update"
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="text-ink/60 hover:text-ink font-medium px-4 py-2 cursor-pointer transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions & Price (View Mode) */}
                                            {editingItemId !== item.id && (
                                                <div className="flex justify-between items-end">
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="flex items-center gap-1.5 px-4 py-1.5 border border-gold/40 rounded-full text-sm font-semibold text-ink hover:bg-cream/60 hover:border-gold/70 transition-colors cursor-pointer"
                                                        >
                                                            <Edit2 size={14} className="text-gold" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-ink/35 hover:text-brand transition-colors cursor-pointer"
                                                            aria-label="Remove from cart"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                    <div className="font-serif text-2xl font-semibold text-ink">
                                                        €{item.item_price}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Summary Card — styled like a fine receipt */}
                            <div className="relative bg-white border border-gold/30 rounded-2xl p-6 shadow-warm-lg overflow-hidden">
                                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                                <p className="eyebrow mb-4">Order summary</p>
                                <div className="flex justify-between items-baseline pb-4 mb-1 border-b border-dashed border-gold/30">
                                    <span className="text-sm font-medium text-ink/70">Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                                    <span className="font-serif text-2xl font-semibold text-ink">€{subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-right text-xs text-laurel font-medium mb-6">All taxes and fees included</p>

                                <button
                                onClick={() => {
                                    router.push('/checkout')
                                }}
                                    // onClick={() => {
                                    //     if (isLoggedIn()) {
                                    //         router.push('/checkout')
                                    //     } else {
                                    //         setIsLoginOpen(true)
                                    //     }
                                    // }}
                                    className="btn-premium w-full py-3.5 rounded-full mb-4"
                                >
                                    Go to checkout
                                </button>

                                <div className="flex items-center gap-2 text-sm text-ink/70">
                                    <Check size={18} className="text-laurel" />
                                    <span>Free cancellation <br /><span className="text-muted-foreground text-xs">Until 24 hours before activity</span></span>
                                </div>
                            </div>

                            {/* Why book with us */}
                            <div className="bg-cream/60 border border-gold/25 rounded-2xl p-6">
                                <h3 className="font-serif text-lg font-semibold text-ink mb-4">Why book with us?</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck size={20} className="text-gold mt-0.5" />
                                        <span className="text-sm text-ink font-medium">Secure payment</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CreditCard size={20} className="text-gold mt-0.5" />
                                        <span className="text-sm text-ink font-medium">No hidden costs</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Headphones size={20} className="text-gold mt-0.5" />
                                        <span className="text-sm text-ink font-medium">24/7 customer support worldwide</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
                    {/* Decorative Header Background */}
                    <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                                <Trash2 className="text-red-600 w-6 h-6" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">Delete Item</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-gray-600 mt-2 max-w-[280px]">
                            Are you sure you want to remove this tour from your cart?
                        </AlertDialogDescription>
                    </div>

                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2 items-start mb-6">
                            <span className="mt-0.5">⚠️</span>
                            <span>This action cannot be undone. You will need to add it again if you change your mind.</span>
                        </div>

                        <div className="flex gap-3">
                            <AlertDialogCancel
                                disabled={isDeleting}
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 h-auto rounded-lg"
                            >
                                Keep Item
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault()
                                    confirmDelete()
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 h-auto rounded-lg shadow-md shadow-red-200"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Deleting...</span>
                                    </div>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>



            <Footer />

        </div>
    )
}
