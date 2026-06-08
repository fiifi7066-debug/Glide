"use client"

import type { TripData } from "@/types"

interface RideCardProps {
  trip: TripData
  onAction?: (action: string) => void
  showActions?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ACCEPTED: "bg-blue-100 text-blue-800 border-blue-200",
  STARTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
}

export default function RideCard({ trip, onAction, showActions = true }: RideCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[trip.status] || "bg-gray-100 text-gray-600"}`}
          >
            {trip.status}
          </span>
          <p className="text-xs text-gray-400 mt-1">{formatDate(trip.createdAt)}</p>
        </div>
        {trip.fare !== null && trip.fare !== undefined && (
          <span className="text-lg font-bold text-primary">GHS {trip.fare}</span>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
          <p className="text-sm text-gray-700">{trip.pickupAddress}</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <p className="text-sm text-gray-700">{trip.dropoffAddress}</p>
        </div>
      </div>

      {trip.distance !== null && trip.distance !== undefined && (
        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>{trip.distance.toFixed(1)} km</span>
          {trip.duration !== null && trip.duration !== undefined && (
            <span>{Math.round(trip.duration)} min</span>
          )}
        </div>
      )}

      {trip.status === "REQUESTED" && showActions && onAction && (
        <button
          onClick={() => onAction("accept")}
          className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl text-sm hover:shadow-lg transition-all"
        >
          Accept Ride
        </button>
      )}

      {trip.status === "ACCEPTED" && showActions && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Driver is on the way
        </div>
      )}

      {trip.status === "STARTED" && showActions && (
        <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Trip in progress
        </div>
      )}
    </div>
  )
}
