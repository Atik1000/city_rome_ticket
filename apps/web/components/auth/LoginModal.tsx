"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { loginUser, setTokens } from "@/services/authService"

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
            toast.success("Login successful! Welcome back.")
            if (onLoginSuccess) onLoginSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message || "Invalid credentials. Please try again.")
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
        </>
    )
}
