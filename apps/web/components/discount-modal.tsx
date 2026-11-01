"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ArrowRight, Percent, Loader2 } from "lucide-react"
import { getTourNotice, type TourNotice } from "@/services/tourService"

export default function DiscountModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [notice, setNotice] = useState<TourNotice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userIPv4, setUserIPv4] = useState<string | null>(null)

  useEffect(() => {
    const initModal = async () => {
      setIsLoading(true)
      try {
        // Fetch user internet IPv4
        const ipResponse = await fetch("https://api4.ipify.org?format=json")
        const ipData = await ipResponse.json()
        const ipv4 = ipData.ip
        setUserIPv4(ipv4)

        // Check recurrence for this specific internet IPv4
        const lastClosedKey = `discount_modal_last_closed_ipv4_${ipv4}`
        const lastClosed = localStorage.getItem(lastClosedKey)
        const now = Date.now()
        const twelveHours = 12 * 60 * 60 * 1000

        if (!lastClosed || now - Number(lastClosed) > twelveHours) {
          // Fetch notice data
          const data = await getTourNotice()
          if (data.results && data.results.length > 0) {
            // Find the first active notice
            const activeNotice = data.results.find((n: TourNotice) => n.is_active)
            if (activeNotice) {
              setNotice(activeNotice)
              setIsOpen(true)
            }
          }
        }
      } catch (error) {
        console.error("Error in DiscountModal IPv4 initialization:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initModal()
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (userIPv4) {
      localStorage.setItem(`discount_modal_last_closed_ipv4_${userIPv4}`, Date.now().toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log("Email submitted:", email)
    handleClose()
    setEmail("")
  }

  if (!isOpen && !isLoading) return null
  if (!isOpen && isLoading) return null

  return (
    <>
      {/* Backdrop - changed from bg-black bg-opacity-40 to bg-black/30 for better transparency and website visibility */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
          {/* Orange Header */}
          <div className="bg-brand px-6 py-2 relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 justify-center">
              <div className="flex-shrink-0 pt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Percent className="h-6 w-6 text-brand" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white flex-1 leading-tight">
              Important Notice
            </h2>
            </div>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-white hover:bg-brand-dark p-1 rounded transition"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* White Body */}
          <div className="px-6 py-6 space-y-4 min-h-[100px] flex flex-col justify-center">
            {isLoading ? (
              <div className="py-1">
                <Loader2 className="animate-spin text-brand" size={40} />
              </div>
            ) : (
              <>
                {notice && (
                  <div className=" space-y-2">
                    <h4 className="text-lg font-semibold text-[#2A2118]">{notice.description}</h4>
                  </div>
                )}

                {/* <p className="text-gray-700 text-center font-medium">To receive your discount, enter your email below.</p> */}

                {/* Email Input Form */}
                {/* <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 transition flex-shrink-0"
                      aria-label="Submit"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </form> */}

                {/* Disclaimer */}
                {/* <p className="text-xs text-gray-600 text-center leading-relaxed">
                  You'll receive occasional promotional emails for Iconic Rome Tickets products. You can opt out at any time.
                </p> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
