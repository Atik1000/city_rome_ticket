"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { loginUser, setTokens } from "@/services/authService"
import { AuthShell } from "@/components/auth/auth-shell"

function LoginForm() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: "", password: "" })

    const nextPath = (() => {
        const next = searchParams.get("next") || "/"
        // Only allow same-site relative redirects
        return next.startsWith("/") && !next.startsWith("//") ? next : "/"
    })()

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
            // Full navigation so the navbar and cart pick up the new session
            setTimeout(() => window.location.assign(nextPath), 900)
        } catch (error: any) {
            toast.error(error.message || "Invalid credentials. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all placeholder:text-ink/35"
                        placeholder="name@example.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all placeholder:text-ink/35"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium w-full py-3.5 mt-2 disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Log In"}
                </button>
            </form>

            <p className="mt-8 text-center text-ink/60 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                    href={`/register${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
                    className="text-brand font-semibold hover:underline underline-offset-4 decoration-gold"
                >
                    Sign Up
                </Link>
            </p>
        </>
    )
}

export default function LoginPage() {
    return (
        <AuthShell
            eyebrow="Iconic Rome Tickets"
            title="Welcome back"
            subtitle="Log in to your account to manage your bookings"
        >
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    )
}
