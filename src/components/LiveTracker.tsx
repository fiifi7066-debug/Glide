"use client"

import { useState } from "react"
import { FiPhone, FiShare2, FiStar } from "react-icons/fi"
import MapView from "@/components/MapView"
import RatingModal from "@/components/RatingModal"
import PaymentModal from "@/components/PaymentModal"
import type { TripData, DeliveryData } from "@/types"

interface LiveTrackerProps {
  trip?: TripData
  delivery?: DeliveryData
}

export default function LiveTracker({ trip, delivery }: LiveTrackerProps) {
  const [showRating, setShowRating] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const isDelivery = !!delivery
  const data = trip || delivery

  if (!data) {
    return <div className="glass-card rounded-2xl p-8 text-center"><p className="text-gray-400">No active trip or delivery</p></div>
  }

  const fare = "fare" in data ? data.fare : 0
  const driver = "driver" in data ? data.driver : undefined
  const pickupAddress = data.pickupAddress
  const dropoffAddress = data.dropoffAddress
  const status = data.status
  const pickupLat = data.pickupLat
  const pickupLng = data.pickupLng
  const dropoffLat = data.dropoffLat
  const dropoffLng = data.dropoffLng

  const isCompleted = status === "COMPLETED" || status === "DELIVERED"
  const isCancelled = status === "CANCELLED"

  const handleRatingSubmit = (score: number, comment: string) => {}
  const handlePayment = (method: string) => {}

  return (
    <div className="space-y-4">
      <MapView pickupLat={pickupLat} pickupLng={pickupLng} dropoffLat={dropoffLat} dropoffLng={dropoffLng} driverLat={driver?.currentLat ?? undefined} driverLng={driver?.currentLng ?? undefined} height="300px" />

      <div className="glass-card rounded-2xl p-5 space-y-4">
        {!isCompleted && !isCancelled && (
          <div className="flex items-center gap-3 pb-4 border-b border-dark-border/50">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 font-bold">
              {driver?.user?.name?.charAt(0) || "D"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{driver?.user?.name || "Driver"}</p>
              {driver && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{driver.vehicleColor} {driver.vehicleModel}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <FiStar size={12} className="text-yellow-500" fill="currentColor" />
                    {driver.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 bg-blue-500/10 rounded-full hover:bg-blue-500/20 transition-colors">
                <FiPhone size={18} className="text-blue-400" />
              </button>
              <button className="p-2.5 bg-dark-border rounded-full hover:bg-dark-border/80 transition-colors">
                <FiShare2 size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {status && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-200">
              {isDelivery ? deliveryStatusText(status) : tripStatusText(status)}
            </span>
          </div>
        )}

        <div className="space-y-3 bg-dark-border/50 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="text-sm text-gray-300">{pickupAddress}</p>
            </div>
          </div>
          <div className="border-l-2 border-dashed border-gray-600 ml-1.5 h-2" />
          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Dropoff</p>
              <p className="text-sm text-gray-300">{dropoffAddress}</p>
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="flex gap-3">
            <button onClick={() => setShowRating(true)} className="flex-1 py-2.5 bg-blue-500/10 text-blue-400 font-medium rounded-xl text-sm hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
              <FiStar size={16} /> Rate Driver
            </button>
            <button onClick={() => setShowPayment(true)} className="flex-1 py-2.5 gradient-btn text-sm">Pay GHS {fare}</button>
          </div>
        )}
      </div>

      <RatingModal isOpen={showRating} onClose={() => setShowRating(false)} onSubmit={handleRatingSubmit} targetName={driver?.user?.name || "Driver"} targetRole="driver" />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} amount={fare || 0} onProcess={handlePayment} />
    </div>
  )
}

function tripStatusText(status: string) {
  switch (status) {
    case "REQUESTED": return "Searching for a driver..."
    case "ACCEPTED": return "Driver is on the way to you"
    case "STARTED": return "On your way to destination"
    case "COMPLETED": return "Trip completed"
    case "CANCELLED": return "Trip cancelled"
    default: return status
  }
}

function deliveryStatusText(status: string) {
  switch (status) {
    case "REQUESTED": return "Searching for a driver..."
    case "ACCEPTED": return "Driver heading to pickup"
    case "PICKED_UP": return "Package picked up"
    case "IN_TRANSIT": return "Package in transit"
    case "DELIVERED": return "Package delivered"
    case "CANCELLED": return "Delivery cancelled"
    default: return status
  }
}
