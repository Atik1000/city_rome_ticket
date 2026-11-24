"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCart, createBooking, BookingPayload, TravelerDetail } from "@/services/tourService"

import { isLoggedIn, getUserProfile, updateUserProfile } from "@/services/authService"
import { Loader2, User, Mail, Globe, Check, AlertCircle, ShieldCheck, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { BookingSuccessModal } from "@/components/booking-success-modal"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { countries } from "@/lib/countries"
import { WhatsAppInput, parseWhatsApp, findCountry } from "@/components/whatsapp-input"


export default function CheckoutPage() {
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [step, setStep] = useState(1) // 1: Contact Info (Guest), 2: Traveler Details
    const [totalAdults, setTotalAdults] = useState(0)
    const [openCountry, setOpenCountry] = useState(false)

    const [isBookNow, setIsBookNow] = useState(false)

    // Booking success modal — redirect happens when the user closes it
    const [successOpen, setSuccessOpen] = useState(false)
    const [successBooking, setSuccessBooking] = useState<{
        id?: number | string
        total_price?: string
        email?: string
    }>({})

    const showMessage = (title: string, content: string, onClose?: () => void) => {
        if (title === "Success") toast.success(content)
        else if (title === "Error" || title.includes("Failed")) toast.error(content)
        else toast.warning(content)
        if (onClose) onClose()
    }

    // Forms
    const [guestDetails, setGuestDetails] = useState({
        full_name: "",
        email: "",
        country: "",
        phone: ""
    })

    const [travelerDetails, setTravelerDetails] = useState<TravelerDetail[]>([])
    const [accountEmail, setAccountEmail] = useState("")
    // WhatsApp number saved on the signed-in account, to tell whether checkout changed it.
    const [profilePhone, setProfilePhone] = useState("")
    const [savingContact, setSavingContact] = useState(false)

    useEffect(() => {
        checkAuthAndLoad()
    }, [])

    const checkAuthAndLoad = async () => {
        setLoading(true)
        const isUserLoggedIn = isLoggedIn()
        setLoggedIn(isUserLoggedIn)

        let prepopulatedName = "";
        if (isUserLoggedIn) {
            // Signed-in customers still see the contact step, filled in from their account.
            try {
                const profile = await getUserProfile();
                prepopulatedName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();
                if (profile.email) setAccountEmail(profile.email);
                const phone = profile.phone ? String(profile.phone) : ""
                setProfilePhone(phone)
                setGuestDetails({
                    full_name: prepopulatedName,
                    email: profile.email || "",
                    country: profile.country || findCountry(parseWhatsApp(phone).iso)?.name || "",
                    phone,
                })
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        } else {
            const savedGuest = localStorage.getItem('guestCheckoutDetails');
            if (savedGuest) {
                try {
                    const parsed = JSON.parse(savedGuest);
                    prepopulatedName = parsed.full_name || "";
                    setGuestDetails(parsed);
                } catch (e) {
                    console.error("Failed to parse guest details", e);
                }
            }
        }

        // Book Now opens /checkout?mode=book_now; anything else (the cart) books the cart.
        // A leftover bookNowData from an abandoned Book Now must never replace the cart.
        const wantsBookNow = new URLSearchParams(window.location.search).get('mode') === 'book_now'
        if (!wantsBookNow) localStorage.removeItem('bookNowData')
        const bookNowDataStr = wantsBookNow ? localStorage.getItem('bookNowData') : null
        let bookNowMode = false
        if (bookNowDataStr) {
            try {
                const bookNowData = JSON.parse(bookNowDataStr)
                setIsBookNow(true)
                bookNowMode = true

                // Set adults count directly from data
                const adults = bookNowData.num_adults || 0 // Default to 0 if not found, though interface implies it exists
                setTotalAdults(adults)

                // Initialize traveler details with prepopulated name for first traveler
                const initialTravelers = Array(adults).fill({ name: "" }).map((t, i) =>
                    i === 0 && prepopulatedName ? { ...t, name: prepopulatedName } : t
                );
                setTravelerDetails(initialTravelers)

                setLoading(false)
                return; // Skip cart loading
            } catch (e) {
                console.error("Failed to parse book now data", e)
                // Fallthrough to cart logic
            }
        }

        // Load cart for adult count if not book now
        const cartIdsStr = localStorage.getItem('cartItemId')
        if (!cartIdsStr) {
            setLoading(false)
            return
        }

        const ids = cartIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n))

        try {
            const cartResponse = await getCart(ids)
            // Calculate total adults across all items
            const adults = cartResponse.results.reduce((acc, item) => acc + item.num_adults, 0)
            setTotalAdults(adults)

            // Initialize traveler details array with prepopulated name for first traveler
            const initialTravelers = Array(adults).fill({ name: "" }).map((t, i) =>
                i === 0 && prepopulatedName ? { ...t, name: prepopulatedName } : t
            );
            setTravelerDetails(initialTravelers)
        } catch (error) {
            console.error("Failed to load cart for checkout", error)
        } finally {
            setLoading(false)
        }
    }

    const handleGuestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loggedIn) {
            // Keep the account's WhatsApp number current with what they confirmed here.
            if (guestDetails.phone.trim() && guestDetails.phone.trim() !== profilePhone) {
                setSavingContact(true)
                try {
                    await updateUserProfile({ phone: guestDetails.phone.trim() })
                    setProfilePhone(guestDetails.phone.trim())
                } catch (error: any) {
                    showMessage("Error", error.message || "Could not save your WhatsApp number. Please check it and try again.")
                    return
                } finally {
                    setSavingContact(false)
                }
            }
        } else {
            // Save to local storage
            localStorage.setItem('guestCheckoutDetails', JSON.stringify(guestDetails))
        }

        // Also update the first traveler's name if not already set or override it
        const newDetails = [...travelerDetails]
        if (newDetails.length > 0) {
            newDetails[0] = { ...newDetails[0], name: guestDetails.full_name }
            setTravelerDetails(newDetails)
        }

        setStep(2)
    }

    const handleTravelerChange = (index: number, field: keyof TravelerDetail, value: string) => {
        const newDetails = [...travelerDetails]
        newDetails[index] = { ...newDetails[index], [field]: value }
        setTravelerDetails(newDetails)
    }

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            let payload: BookingPayload;

            if (isBookNow) {
                const bookNowDataStr = localStorage.getItem('bookNowData')
                if (!bookNowDataStr) throw new Error("Missing booking data")
                const bookNowData = JSON.parse(bookNowDataStr)

                payload = {
                    book_now: "true",
                    single_item: bookNowData,
                    traveler_details: travelerDetails
                }
            } else {
                const cartIdsStr = localStorage.getItem('cartItemId')
                if (!cartIdsStr) throw new Error("No items in cart")

                payload = {
                    cart_item_ids: cartIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n)),
                    traveler_details: travelerDetails
                }
            }

            // Contact details from step 1 (guests type them, signed-in customers confirm them).
            payload.full_name = guestDetails.full_name
            payload.email = guestDetails.email
            payload.country = guestDetails.country
            payload.phone = guestDetails.phone.trim()

            let token = undefined;
            if (loggedIn) {
                const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
                if (match) {
                    token = match[2];
                }
            }

            const booking = await createBooking(payload, token)

            // Clear the basket now; the redirect waits for the user to close the modal
            if (isBookNow) {
                localStorage.removeItem('bookNowData')
            } else {
                localStorage.removeItem('cartItemId')
            }
            localStorage.removeItem('guestCheckoutDetails')

            setSuccessBooking({
                id: booking?.id,
                total_price: booking?.total_price,
                email: booking?.email || accountEmail || guestDetails.email || undefined,
            })
            setSuccessOpen(true)

        } catch (error: any) {
            console.error("Booking failed", error)
            showMessage("Error", error.message || "Booking failed")
        } finally {
            setLoading(false)
        }
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

            <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <p className="eyebrow mb-2">Final step</p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink mb-4">Checkout</h1>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream/60 px-3 py-1.5 font-medium"><ShieldCheck size={14} className="text-gold" /> Secure checkout</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream/60 px-3 py-1.5 font-medium"><Check size={14} className="text-gold" /> Instant mobile tickets</span>
                </div>

                {/* Stepper (Roman ordinals) */}
                {!loggedIn && (
                    <div className="flex items-center gap-3 mb-8" aria-hidden="true">
                        <div className="flex items-center gap-2.5">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm font-semibold border transition-colors ${step === 1 ? "bg-brand text-white border-brand shadow-warm" : "bg-espresso text-white border-gold/50"}`}>I</span>
                            <span className={`text-sm font-medium ${step === 1 ? "text-ink" : "text-ink/50"}`}>Contact</span>
                        </div>
                        <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-gold/60 to-gold/20" />
                        <div className="flex items-center gap-2.5">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm font-semibold border transition-colors ${step === 2 ? "bg-brand text-white border-brand shadow-warm" : "bg-white text-ink/50 border-ink/20"}`}>II</span>
                            <span className={`text-sm font-medium ${step === 2 ? "text-ink" : "text-ink/50"}`}>Travelers</span>
                        </div>
                    </div>
                )}

                {/* Step 1: Contact Info (prefilled for signed-in customers) */}
                {step === 1 && (
                    <div className="relative bg-white rounded-2xl shadow-warm-lg border border-gold/30 p-6 sm:p-8 overflow-hidden">
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Contact Details</h2>
                        <form onSubmit={handleGuestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                        placeholder="John Doe"
                                        value={guestDetails.full_name}
                                        onChange={e => setGuestDetails({ ...guestDetails, full_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all read-only:bg-cream/40 read-only:text-ink/60"
                                        placeholder="john@example.com"
                                        readOnly={loggedIn}
                                        title={loggedIn ? "This is your account email" : undefined}
                                        value={guestDetails.email}
                                        onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-ink mb-1.5">Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    role="combobox"
                                                    aria-expanded={openCountry}
                                                    className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none text-left flex justify-between items-center text-sm transition-all hover:bg-cream/40 hover:border-gold/60 cursor-pointer"
                                                >
                                                    {guestDetails.country ? (
                                                        <span className="font-medium text-gray-900">
                                                            {countries.find((country) => country.name === guestDetails.country)?.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Select Country</span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[310px] p-1 bg-white border border-gray-200 shadow-xl rounded-xl max-h-[400px]" align="start">
                                                <Command className="w-full">
                                                    <div className="px-2 pt-2 pb-1">
                                                        <CommandInput
                                                            placeholder="Search country..."
                                                            className="h-10 rounded-lg bg-gray-50 border-0 focus:ring-0 px-3 text-sm"
                                                        />
                                                    </div>
                                                    <div className="h-[1px] bg-gray-100 mx-2 mb-1" />
                                                    <CommandList className="max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                                                        <CommandEmpty className="py-6 text-center text-sm text-gray-500">No country found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {[...countries].sort((a, b) => {
                                                                if (a.name === guestDetails.country) return -1
                                                                if (b.name === guestDetails.country) return 1
                                                                return 0
                                                            }).map((country) => (
                                                                <CommandItem
                                                                    key={country.code}
                                                                    value={country.name}
                                                                    className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-cream hover:text-brand-dark transition-colors rounded-lg mx-1 my-0.5 group aria-selected:bg-cream"
                                                                    onSelect={(currentValue) => {
                                                                        setGuestDetails({ ...guestDetails, country: country.name })
                                                                        setOpenCountry(false)
                                                                    }}
                                                                >
                                                                    <div className={cn(
                                                                        "flex items-center justify-center w-5 h-5 rounded-full border transition-all shrink-0",
                                                                        guestDetails.country === country.name
                                                                            ? "bg-brand border-brand"
                                                                            : "border-gray-200 group-hover:border-gold"
                                                                    )}>
                                                                        {guestDetails.country === country.name && (
                                                                            <Check className="h-3 w-3 text-white" />
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <span className={cn(
                                                                            "font-medium transition-colors text-sm",
                                                                            guestDetails.country === country.name ? "text-brand-dark" : "text-gray-700 group-hover:text-brand-dark"
                                                                        )}>
                                                                            {country.name}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-ink mb-1.5">WhatsApp</label>
                                    <WhatsAppInput
                                        value={guestDetails.phone}
                                        onChange={(phone) => setGuestDetails((d) => ({ ...d, phone }))}
                                        countryHint={guestDetails.country}
                                        fieldClassName="border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25"
                                        activeItemClassName="bg-cream text-brand-dark"
                                    />
                                    <p className="mt-1.5 text-xs text-ink/50">We&apos;ll send your booking details and updates here.</p>
                                </div>
                            </div>

                            <button type="submit" disabled={savingContact} className="btn-premium w-full py-3.5 mt-4 disabled:opacity-70 flex items-center justify-center gap-2">
                                {savingContact && <Loader2 className="animate-spin" size={18} />}
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Traveler Details */}
                {step === 2 && (
                    <div className="relative bg-white rounded-2xl shadow-warm-lg border border-gold/30 p-6 sm:p-8 overflow-hidden">
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Traveler Details</h2>
                        <form onSubmit={handleFinalSubmit}>
                        <div className="space-y-6">
                            {travelerDetails.map((traveler, index) => (
                                <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <h3 className="font-serif font-semibold text-ink mb-3">Adult {index + 1}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-ink/60 mb-1.5">Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                                value={traveler.name}
                                                onChange={e => handleTravelerChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="btn-premium w-full py-3.5 mt-8"
                        >
                            <Check size={20} />
                            Final Submit
                        </button>
                        </form>
                    </div>
                )}
            </main>

            <Footer />

            <BookingSuccessModal
                open={successOpen}
                onClose={() => {
                    setSuccessOpen(false)
                    window.location.href = "/"
                }}
                bookingId={successBooking.id}
                totalPrice={successBooking.total_price}
            />

        </div>
    )
}
