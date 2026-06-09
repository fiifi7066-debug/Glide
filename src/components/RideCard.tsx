"use client"

import type { TripData } from "@/types"

interface RideCardProps {
  trip: TripData
  onAction?: (action: string) => void
  showActions?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ACCEPTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  STARTED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function RideCard({ trip, onAction, showActions = true }: RideCardProps) {
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="glass-card rounded-xl p-4 hover:border-blue-500/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[trip.status] || "bg-dark-border text-gray-400"}`}>{trip.status}</span>
          <p className="text-xs text-gray-500 mt-1">{formatDate(trip.createdAt)}</p>
        </div>
        {trip.fare !== null && trip.fare !== undefined && <span className="text-lg font-bold text-blue-400">GHS {trip.fare}</span>}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
          <p className="text-sm text-gray-300">{trip.pickupAddress}</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
          <p className="text-sm text-gray-300">{trip.dropoffAddress}</p>
        </div>
      </div>

      {trip.distance !== null && trip.distance !== undefined && (
        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>{trip.distance.toFixed(1)} km</span>
          {trip.duration !== null && trip.duration !== undefined && <span>{Math.round(trip.duration)} min</span>}
        </div>
      )}

      {trip.status === "REQUESTED" && showActions && onAction && (
        <button onClick={() => onAction("accept")} className="w-full py-2.5 gradient-btn text-sm">Accept Ride</button>
      )}

      {trip.status === "ACCEPTED" && showActions && (
        <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />Driver is on the way
        </div>
      )}

      {trip.status === "STARTED" && showActions && (
        <div className="flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />Trip in progress
        </div>
      )}
    </div>
  )
}
