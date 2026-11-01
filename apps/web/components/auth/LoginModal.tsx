"use client"

import { useState } from "react"
import { X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { loginUser, setTokens } from "@/services/authService"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToRegister: () => void
    onLoginSuccess?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }: LoginModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
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

    const handleAlertClose = () => {
        setAlertDialogState(prev => ({ ...prev, isOpen: false }))
        if (alertDialogState.type === 'success') {
            if (onLoginSuccess) onLoginSuccess()
            onClose()
        }
    }

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await loginUser(formData)
            setTokens(data)
            showAlert("Success", "Login successful!", 'success')
        } catch (error: any) {
            showAlert("Login Failed", error.message || "Invalid credentials. Please try again.", 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-md bg-white rounded-2xl shadow-warm-lg border border-gold/25 p-8 animate-in zoom-in-95 duration-200 overflow-hidden">
                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-8 text-center">
                        <p className="eyebrow mb-2">Iconic Rome Tickets</p>
                        <h2 className="font-serif text-3xl font-semibold text-ink">Welcome back</h2>
                        <p className="text-gray-500 mt-2">Log in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-ink">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-ink/15 focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all placeholder:text-ink/35"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-ink">Password</label>
                                <button type="button" className="text-xs text-brand font-medium hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-ink/15 focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all placeholder:text-ink/35"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-premium w-full py-3 mt-6 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-brand font-semibold hover:underline underline-offset-4 decoration-gold cursor-pointer"
                            >
                                Sign Up
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
                            className="btn-premium py-3 px-12 rounded-full border-none"
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
