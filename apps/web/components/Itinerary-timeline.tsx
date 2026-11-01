import { Info } from "lucide-react"
import { TourLocation } from "@/services/tourService"

interface TimelineStop {
  id: number
  title: string
  description: string
  type: "start" | "stop" | "end"
}

/** Display-only Roman numeral for itinerary step ordinals (1–3999). */
function toRoman(n: number): string {
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ]
  let out = ""
  for (const [v, s] of table) {
    while (n >= v) {
      out += s
      n -= v
    }
  }
  return out
}

function StopMarker({ type, index }: { type: TimelineStop["type"]; index: number }) {
  const numeral = toRoman(index + 1)
  if (type === "start" || type === "end") {
    return (
      <div className="w-9 h-9 rounded-full bg-brand text-white ring-2 ring-gold/40 ring-offset-2 ring-offset-background flex items-center justify-center font-serif font-semibold text-xs shadow-warm">
        {numeral}
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-white border border-gold/60 text-brand flex items-center justify-center font-serif font-semibold text-xs shadow-warm">
      {numeral}
    </div>
  )
}

export function ItineraryTimeline({ locations = [] }: { locations?: TourLocation[] }) {
  const itinerary: TimelineStop[] = locations.map((loc, index) => {
    let type: TimelineStop["type"] = "stop"
    if (index === 0) type = "start"
    else if (index === locations.length - 1) type = "end"

    return {
      id: loc.id,
      title: loc.name,
      description: loc.description,
      type: type,
    }
  })

  return (
    <div className="w-full">
      <p className="eyebrow mb-2">Step by step</p>
      <h3 className="font-serif text-2xl font-semibold text-ink mb-8">Itinerary</h3>

      <div className="relative">
        {/* Vertical gold hairline */}
        <div
          aria-hidden="true"
          className="absolute left-[17px] top-3 bottom-3 w-px bg-gradient-to-b from-gold/60 via-gold/35 to-gold/60"
        />

        {/* Timeline items */}
        <div className="space-y-6 relative z-10">
          {itinerary.map((stop, idx) => (
            <div key={stop.id} className="flex gap-4 items-start">
              {/* Marker */}
              <div className="flex-shrink-0 relative z-20">
                <StopMarker type={stop.type} index={idx} />
              </div>

              {/* Content */}
              <div className="pt-1.5">
                <h4 className="font-semibold text-ink text-sm">{stop.title}</h4>
                <p className="text-ink/65 text-sm leading-relaxed mt-0.5">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference note */}
      <div className="flex items-start gap-2 mt-8 text-xs text-muted-foreground">
        <Info size={16} className="flex-shrink-0 mt-0.5 text-gold" />
        <span>For reference only. Itineraries are subject to change.</span>
      </div>
    </div>
  )
}
