import { MapPin, Bus, Info } from "lucide-react"
import { TourLocation } from "@/services/tourService"

interface TimelineStop {
  id: number
  title: string
  description: string
  type: "start" | "stop" | "waypoint" | "end" | "transport" | "activity"
  duration?: string
  icon?: string
}

function getIconForType(type: TimelineStop["type"]) {
  switch (type) {
    case "start":
      return (
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
          G
        </div>
      )
    case "end":
      return (
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
          G
        </div>
      )
    case "transport":
      return (
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-400 text-gray-600 flex items-center justify-center">
          <Bus size={18} />
        </div>
      )
    case "stop":
      return (
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-900 text-gray-900 flex items-center justify-center">
          <MapPin size={18} />
        </div>
      )
    case "waypoint":
      return (
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
      )
    case "activity":
      return (
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-900 text-gray-900 flex items-center justify-center">
          <MapPin size={18} />
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>
      )
  }
}

export function ItineraryTimeline({ locations = [] }: { locations?: TourLocation[] }) {

  const itinerary: TimelineStop[] = locations.map((loc, index) => {
    let type: TimelineStop['type'] = 'stop'
    if (index === 0) type = 'start'
    else if (index === locations.length - 1) type = 'end'

    return {
      id: loc.id,
      title: loc.name,
      description: loc.description,
      type: type
    }
  })

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Itinerary</h3>

      <div className="flex gap-8">
        {/* Left: Timeline */}
        <div className="flex-1">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-3 w-1 bg-gray-200"></div>
            {/* Note: Original had orange line, using gray for cleaner look if requested, but sticking to design.. user asked not to change design.
                 Original code: <div className="absolute left-2 top-2 bottom-3 w-4 bg-brand"></div> 
                 Wait, line 132 in original is `w-4 bg-brand` at `left-2`.
                 I should keep the original styling for the timeline container.
             */}
            <div className="absolute left-2 top-2 bottom-3 w-4 bg-brand opacity-20 hidden"></div>
            {/* The previous design had a specific look. I will try to preserve the loop structure exactly as user requested in the prompt snippet. */}

            {/* Re-implementing the structure to match EXACTLY what was there but with dynamic data */}
            <div className="absolute left-2 top-2 bottom-3 w-4 bg-brand"></div>

            {/* Timeline items */}
            <div className="space-y-4 relative z-10">
              {itinerary.map((stop, idx) => (
                <div key={stop.id} className="flex gap-4 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0 relative z-20 pt-1">{getIconForType(stop.type)}</div>

                  {/* Content */}
                  <div className="pt-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{stop.title}</h4>
                    <p className="text-gray-600 text-sm">{stop.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dotted line indicators */}
            <div className="absolute left-4 top-0 bottom-0 w-1 opacity-30">
              <div className="h-full flex flex-col justify-around">
                {itinerary.slice(1, -1).map((_, idx) => (
                  <div key={idx} className="w-1 h-1 rounded-full bg-gold-light"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Placeholder */}
        {/* <div className="flex-1">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden h-147 relative flex items-center justify-center">
            <img src="/switzerland-map-with-tour-route.jpg" alt="Tour route map" className="w-full h-full object-fixed" /> */}

        {/* Map legend */}
        {/* <div className="absolute bottom-4 left-4 bg-white rounded px-3 py-2 text-xs font-semibold flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand"></div>
                <span>Main stop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-gray-400"></div>
                <span>Other stop</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Reference note */}
      <div className="flex items-start gap-2 mt-6 text-xs text-gray-600">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <span>For reference only. Itineraries are subject to change.</span>
      </div>
    </div>
  )
}
