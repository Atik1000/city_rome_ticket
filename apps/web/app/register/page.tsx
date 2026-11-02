"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { registerUser } from "@/services/authService"
import { AuthShell } from "@/components/auth/auth-shell"

const inputClass =
    "w-full px-4 py-3 rounded-xl border border-ink/15 bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all placeholder:text-ink/35"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        first_name: "",
        last_name: "",
        password: "",
    })

    const nextPath = (() => {
        const next = searchParams.get("next") || "/"
        return next.startsWith("/") && !next.startsWith("//") ? next : "/"
    })()

    const loginHref = `/login${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await registerUser(formData)
            toast.success("Registration successful! Please log in with your new account.")
            router.push(loginHref)
        } catch (error: any) {
            toast.error(error.message || "Registration failed. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label htmlFor="first_name" className="text-sm font-medium text-ink">First Name</label>
                        <input
                            id="first_name"
                            name="first_name"
                            required
                            autoComplete="given-name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="John"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="last_name" className="text-sm font-medium text-ink">Last Name</label>
                        <input
                            id="last_name"
                            name="last_name"
                            required
                            autoComplete="family-name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Doe"
                        />
                    </div>
                </div>

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
                        className={inputClass}
                        placeholder="name@example.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-sm font-medium text-ink">Phone</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="+1 234 567 890"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium w-full py-3.5 mt-2 disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create Account"}
                </button>
            </form>

            <p className="mt-8 text-center text-ink/60 text-sm">
                Already have an account?{" "}
                <Link
                    href={loginHref}
                    className="text-brand font-semibold hover:underline underline-offset-4 decoration-gold"
                >
                    Log In
                </Link>
            </p>
        </>
    )
}

export default function RegisterPage() {
    return (
        <AuthShell
            eyebrow="Iconic Rome Tickets"
            title="Create an account"
            subtitle="Join us to book skip-the-line tours across Rome"
        >
            <Suspense fallback={null}>
                <RegisterForm />
            </Suspense>
        </AuthShell>
    )
}
