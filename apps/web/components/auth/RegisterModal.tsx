"use client"

import { useState } from "react"
import { X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { registerUser } from "@/services/authService"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RegisterModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        first_name: "",
        last_name: "",
        password: "",
    })

    // Alert Dialog state
    const [alertDialogState, setAlertDialogState] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        title: "",
        description: "",
        type: 'success'
    })

    const showAlert = (title: string, description: string, type: 'success' | 'error') => {
        setAlertDialogState({ isOpen: true, title, description, type })
    }

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await registerUser(formData)
            // Show success modal before closing
            showAlert("Success!", "Registration successful! Please log in with your new account.", 'success')
        } catch (error: any) {
            showAlert("Registration Failed", error.message || "Something went wrong. Please try again.", 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAlertClose = () => {
        setAlertDialogState(prev => ({ ...prev, isOpen: false }))
        if (alertDialogState.type === 'success') {
            onSwitchToLogin()
            onClose()
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in zoom-in-95 duration-200">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-[#2A2118]">Create an account</h2>
                        <p className="text-gray-500 mt-2">Join us to explore the world</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#2A2118]">First Name</label>
                                <input
                                    name="first_name"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-cream outline-none transition-all placeholder:text-gray-400"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#2A2118]">Last Name</label>
                                <input
                                    name="last_name"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-cream outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#2A2118]">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-cream outline-none transition-all placeholder:text-gray-400"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#2A2118]">Phone</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-cream outline-none transition-all placeholder:text-gray-400"
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#2A2118]">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-cream outline-none transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Register"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-brand font-bold hover:underline"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <AlertDialog open={alertDialogState.isOpen} onOpenChange={(open) => !open && handleAlertClose()}>
                <AlertDialogContent className="bg-white rounded-2xl p-8 max-w-sm z-[1000]">
                    <AlertDialogHeader>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${alertDialogState.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            {alertDialogState.type === 'success' ? (
                                <CheckCircle2 className="text-green-600 w-8 h-8" />
                            ) : (
                                <AlertTriangle className="text-red-600 w-8 h-8" />
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
                        <AlertDialogAction
                            onClick={handleAlertClose}
                            className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-12 rounded-full transition-all shadow-lg shadow-brand/20 border-none outline-none"
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
