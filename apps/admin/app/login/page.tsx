'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Landmark, ShieldCheck, Ticket, CalendarCheck } from 'lucide-react'
import { useAuth } from '@/app/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | string[]>('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const router = useRouter()
  const { login } = useAuth()
  const reduceMotion = useReducedMotion()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorDetails('')

    try {
      const result = await login(email, password)
      if (result.success) {
        router.push('/dashboard')
      } else {
        setErrorDetails(result.error || 'Invalid email or password')
        setShakeKey((k) => k + 1)
        setIsAlertOpen(true)
      }
    } catch (err) {
      setErrorDetails('An unexpected error occurred. Please try again.')
      setShakeKey((k) => k + 1)
      setIsAlertOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Rome imagery with brand overlay */}
      <div className="hidden lg:flex relative w-1/2 xl:w-[55%]">
        <img
          src={HERO_IMAGE}
          alt="The Colosseum, Rome"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a0d0a]/95 via-[#5c1813]/75 to-[#9E2B25]/40" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-[#E9C77F]/40 flex items-center justify-center">
              <Landmark size={22} className="text-[#E9C77F]" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-display font-semibold text-lg tracking-tight">Iconic Rome</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#E9C77F] font-semibold">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="space-y-8 max-w-lg">
            <div className="gold-hairline w-24" aria-hidden="true" />
            <h2 className="font-display text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight">
              The Eternal City,
              <br />
              <span className="text-[#E9C77F]">expertly managed.</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Run tours, bookings and customer requests for Iconic Rome Tickets
              from one place.
            </p>
            <div className="space-y-3">
              {[
                { icon: Ticket, label: 'Manage tours, pricing and availability' },
                { icon: CalendarCheck, label: 'Create and track bookings in real time' },
                { icon: ShieldCheck, label: 'Secure access for your whole team' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-white/90">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#E9C77F]/25 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#E9C77F]" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/50 text-xs tracking-wide">
            © {new Date().getFullYear()} Iconic Rome Tickets
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          className="w-full max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Brand mark (visible where the hero panel is hidden) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-md ring-1 ring-gold/40">
              <Landmark size={22} className="text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-semibold text-lg tracking-tight text-foreground">Iconic Rome</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-warm-lg overflow-hidden">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold/70 to-transparent"
              aria-hidden="true"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold mb-2">
              Admin sign in
            </p>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base">
              Sign in to manage your tours and bookings
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@iconicrometours.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-border bg-background/60 text-sm"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-border bg-background/60 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm sm:text-base cursor-pointer shadow-lg shadow-primary/20"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Restricted area — authorized staff of Iconic Rome Tickets only.
          </p>
        </motion.div>
      </div>

      {/* Error Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <motion.div
            key={shakeKey}
            animate={reduceMotion ? undefined : { x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Authentication Error</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-1">
                  {Array.isArray(errorDetails) ? (
                    <ul className="list-disc list-inside">
                      {errorDetails.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>{errorDetails}</span>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </motion.div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
