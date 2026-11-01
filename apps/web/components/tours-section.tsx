"use client"

import { useEffect, useState } from "react"
import TourCard from "./tour-card"
import { getTourPlans, TourPlan } from "@/services/tourService"
import { Loader2 } from "lucide-react"

export default function ToursSection() {
  const [tours, setTours] = useState<TourPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTours(1)
  }, [])

  const fetchTours = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const data = await getTourPlans({ page: pageNum })

      if (pageNum === 1) {
        setTours(data.results)
      } else {
        setTours(prev => [...prev, ...data.results])
      }

      // Check if there is a next page
      setHasMore(!!data.next)
    } catch (err: any) {
      setError(err.message || "Failed to load tours")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSeeMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchTours(nextPage)
  }

  return (
    <section className="w-full bg-background py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold mb-3">
            Handpicked experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
            Rome&apos;s Most-Loved Tours
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            From the arena floor of the Colosseum to the Sistine Chapel at dawn — skip the
            queues and see the Eternal City with people who know it best.
          </p>
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center">
            {error}
            <button
              onClick={() => fetchTours(1)}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-brand" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {tours.length === 0 && !error && (
              <div className="text-center py-12 text-gray-500">
                No tours found.
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleSeeMore}
                  disabled={loadingMore}
                  className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore && <Loader2 className="animate-spin" size={16} />}
                  {loadingMore ? 'Loading...' : 'See more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
