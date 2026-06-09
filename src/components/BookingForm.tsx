"use client"

import { useState } from "react"
import { FiMapPin, FiNavigation } from "react-icons/fi"

interface BookingFormProps {
  onRequestRide: (data: { pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number; pickupAddress: string; dropoffAddress: string }) => void
}

const MOCK_PICKUP = { lat: 5.6037, lng: -0.1870, address: "123 Independence Ave, Accra" }
const MOCK_DROPOFF = { lat: 5.6500, lng: -0.1900, address: "456 Liberation Road, Accra" }

export default function BookingForm({ onRequestRide }: BookingFormProps) {
  const [pickup, setPickup] = useState(MOCK_PICKUP.address)
  const [dropoff, setDropoff] = useState(MOCK_DROPOFF.address)
  const [estimating, setEstimating] = useState(false)
  const [fare, setFare] = useState<number | null>(null)

  const handleEstimate = () => {
    if (!pickup || !dropoff) return
    setEstimating(true)
    setTimeout(() => { setFare(Math.floor(Math.random() * (50 - 15 + 1) + 15)); setEstimating(false) }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) return
    onRequestRide({ pickupLat: MOCK_PICKUP.lat, pickupLng: MOCK_PICKUP.lng, dropoffLat: MOCK_DROPOFF.lat, dropoffLng: MOCK_DROPOFF.lng, pickupAddress: pickup, dropoffAddress: dropoff })
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">Book a Ride</h2>

      <div className="space-y-3">
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={18} />
          <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => { setPickup(e.target.value); setFare(null) }} className="input-dark pl-10" />
        </div>
        <div className="relative">
          <FiNavigation className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
          <input type="text" placeholder="Dropoff Location" value={dropoff} onChange={(e) => { setDropoff(e.target.value); setFare(null) }} className="input-dark pl-10" />
        </div>
      </div>

      {fare === null && pickup && dropoff && (
        <button type="button" onClick={handleEstimate} disabled={estimating}
          className="w-full py-2.5 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors disabled:opacity-50">
          {estimating ? "Estimating..." : "Show Fare Estimate"}
        </button>
      )}

      {fare !== null && (
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Estimated Fare</span>
            <span className="text-2xl font-bold text-blue-400">GHS {fare}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Price may vary based on traffic and demand</div>
        </div>
      )}

      <button type="submit" disabled={!pickup || !dropoff} className="w-full py-3.5 gradient-btn">
        Request Ride
      </button>
    </form>
  )
}
