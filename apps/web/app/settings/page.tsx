"use client"

import React, { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { User, Bell, CreditCard, ChevronDown, Loader2, AlertTriangle, Trash2, History, Calendar, DollarSign, Tag } from "lucide-react"
import { getUserProfile, updateUserProfile, deleteUserAccount, removeTokens } from "@/services/authService"
import { getBookingHistory } from "@/services/tourService"
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

export default function SettingsPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saveLoading, setSaveLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'personal' | 'history'>('personal')
    const [bookings, setBookings] = useState<any[]>([])
    const [bookingsLoading, setBookingsLoading] = useState(false)

    // Alert Dialog state
    const [alertDialogState, setAlertDialogState] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: 'success' | 'error' | 'info';
    }>({
        isOpen: false,
        title: "",
        description: "",
        type: 'info'
    })

    const showAlert = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertDialogState({ isOpen: true, title, description, type })
    }

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        day: "",
        month: "",
        year: ""
    })

    // Dropdown options
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    const years = Array.from({ length: 121 }, (_, i) => (2026 - i).toString())

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile()
                setProfile(data)

                // Parse dob (YYYY-MM-DD)
                let d = "", m = "", y = ""
                if (data.dob) {
                    const parts = data.dob.split('-')
                    y = parts[0]
                    m = months[parseInt(parts[1]) - 1]
                    d = parts[2]
                }

                setFormData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || data.mobile || "",
                    day: d,
                    month: m,
                    year: y
                })
            } catch (err) {
                console.error("Failed to load profile", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    useEffect(() => {
        if (activeTab === 'history') {
            fetchBookings()
        }
    }, [activeTab])

    const fetchBookings = async () => {
        setBookingsLoading(true)
        try {
            const data = await getBookingHistory()
            setBookings(data.results || [])
        } catch (err) {
            console.error("Failed to fetch bookings", err)
        } finally {
            setBookingsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setSaveLoading(true)
        try {
            let formattedDob = null
            if (formData.year && formData.month && formData.day) {
                const monthIndex = (months.indexOf(formData.month) + 1).toString().padStart(2, '0')
                formattedDob = `${formData.year}-${monthIndex}-${formData.day.padStart(2, '0')}`
            }

            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                dob: formattedDob
            }

            await updateUserProfile(payload)
            showAlert("Success", "Settings updated successfully!", 'success')
        } catch (err: any) {
            showAlert("Error", err.message || "Failed to update settings", 'error')
        } finally {
            setSaveLoading(false)
        }
    }

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true)
        try {
            await deleteUserAccount()
            removeTokens()
            router.push('/')
        } catch (err: any) {
            showAlert("Error", err.message || "Failed to delete account", 'error')
        } finally {
            setDeleteLoading(false)
            setIsDeleteModalOpen(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center p-32">
                    <Loader2 className="animate-spin text-brand" size={40} />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-[#2A2118]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 border border-gold/25 rounded-2xl overflow-hidden self-start shadow-warm">
                        <div className="relative overflow-hidden bg-espresso p-8 text-white text-center">
                            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                            <h2 className="font-serif text-2xl font-semibold mb-1">{profile?.first_name} {profile?.last_name}</h2>
                            <p className="text-gold-light/80 text-xs uppercase tracking-[0.25em]">Account</p>
                        </div>
                        <nav className="bg-[#F3EEE6]">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={` cursor-pointer w-full flex items-center gap-3 p-4 transition-colors border-b border-gray-100 ${activeTab === 'personal' ? 'bg-white font-bold text-[#2A2118]' : 'text-gray-600 hover:bg-white'}`}
                            >
                                <User size={20} className={activeTab === 'personal' ? 'text-[#2A2118]' : 'text-gray-500'} />
                                <span>Personal details</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={` cursor-pointer w-full flex items-center gap-3 p-4 transition-colors ${activeTab === 'history' ? 'bg-white font-bold text-[#2A2118]' : 'text-gray-600 hover:bg-white'}`}
                            >
                                <History size={20} className={activeTab === 'history' ? 'text-[#2A2118]' : 'text-gray-500'} />
                                <span>Booking History</span>
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        {activeTab === 'personal' ? (
                            <div className="space-y-10">
                                {/* Profile Details */}
                                <section>
                                    <h3 className="font-serif text-2xl font-semibold text-ink mb-6">Profile Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                        <div className="relative">
                                            <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs text-gray-500 z-10">First Name</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs text-gray-500 z-10">Last Name</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Contact Details */}
                                <section>
                                    <h3 className="font-serif text-2xl font-semibold text-ink mb-6">Contact Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="absolute -top-2.5 left-3 px-1 bg-gray-100 text-xs text-gray-500 z-10">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl bg-gray-100 text-gray-600 outline-none font-medium"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs text-gray-500 z-10">Mobile Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Date of Birth */}
                                <section>
                                    <h3 className="font-serif text-2xl font-semibold text-ink mb-6">Date of birth</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="relative">
                                            <select
                                                name="day"
                                                value={formData.day}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium bg-white appearance-none"
                                            >
                                                <option value="">Day</option>
                                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                        <div className="relative">
                                            <select
                                                name="month"
                                                value={formData.month}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium bg-white appearance-none"
                                            >
                                                <option value="">Month</option>
                                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                        <div className="relative">
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border border-ink/15 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition font-medium bg-white appearance-none"
                                            >
                                                <option value="">Year</option>
                                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </section>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saveLoading}
                                        className="btn-premium px-10 py-3 rounded-full disabled:opacity-50"
                                    >
                                        {saveLoading && <Loader2 size={16} className="animate-spin" />}
                                        Save
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Delete Account */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="cursor-pointer text-red-600 font-bold hover:underline underline-offset-4 decoration-current"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="font-serif text-2xl font-semibold text-ink mb-6">Booking History</h3>
                                {bookingsLoading ? (
                                    <div className="flex justify-center p-12">
                                        <Loader2 className="animate-spin text-brand" size={32} />
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <History size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-500 font-medium">No bookings found in your history.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[#F3EEE6] border-b border-gray-100">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Booking ID</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Date</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Total Price</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {bookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <Tag size={16} className="text-brand" />
                                                                <span className="font-bold text-[#2A2118]">#{booking.id}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Calendar size={16} />
                                                                <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-1 text-green-600 font-bold">
                                                                <DollarSign size={16} />
                                                                <span>{booking.total_price}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'open' ? 'bg-cream text-brand' :
                                                                booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                                    'bg-gray-50 text-gray-600'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl scale-95 animate-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="text-red-600 w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#2A2118] mb-2">Delete Account?</h2>
                            <p className="text-gray-500 mb-8">
                                Ar you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently removed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {deleteLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    Delete
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteLoading}
                                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Alert Dialog */}
            <AlertDialog open={alertDialogState.isOpen} onOpenChange={(open) => setAlertDialogState(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent className="bg-white rounded-2xl p-8 max-w-sm">
                    <AlertDialogHeader>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${alertDialogState.type === 'success' ? 'bg-green-50' : alertDialogState.type === 'error' ? 'bg-red-50' : 'bg-cream'}`}>
                            {alertDialogState.type === 'success' ? (
                                <DollarSign className="text-green-600 w-8 h-8" />
                            ) : alertDialogState.type === 'error' ? (
                                <AlertTriangle className="text-red-600 w-8 h-8" />
                            ) : (
                                <Bell className="text-brand w-8 h-8" />
                            )}
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold text-[#2A2118] text-center">
                            {alertDialogState.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 text-center text-base pt-2">
                            {alertDialogState.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-6 sm:justify-center">
                        <AlertDialogAction className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-12 rounded-full transition-all shadow-lg shadow-brand/20 border-none outline-none">
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Footer />
        </div>
    )
}
