"use client"

import { useState } from "react"
import { FiMapPin, FiNavigation } from "react-icons/fi"

interface BookingFormProps {
  onRequestRide: (data: {
    pickupLat: number
    pickupLng: number
    dropoffLat: number
    dropoffLng: number
    pickupAddress: string
    dropoffAddress: string
  }) => void
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
    const mockFare = Math.floor(Math.random() * (50 - 15 + 1) + 15)
    setTimeout(() => {
      setFare(mockFare)
      setEstimating(false)
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) return
    onRequestRide({
      pickupLat: MOCK_PICKUP.lat,
      pickupLng: MOCK_PICKUP.lng,
      dropoffLat: MOCK_DROPOFF.lat,
      dropoffLng: MOCK_DROPOFF.lng,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Book a Ride</h2>

      <div className="space-y-3">
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => { setPickup(e.target.value); setFare(null) }}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="relative">
          <FiNavigation className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
          <input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={(e) => { setDropoff(e.target.value); setFare(null) }}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      {fare === null && pickup && dropoff && (
        <button
          type="button"
          onClick={handleEstimate}
          disabled={estimating}
          className="w-full py-2.5 text-sm font-medium text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {estimating ? "Estimating..." : "Show Fare Estimate"}
        </button>
      )}

      {fare !== null && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Estimated Fare</span>
            <span className="text-2xl font-bold text-primary">GHS {fare}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Price may vary based on traffic and demand</div>
        </div>
      )}

      <button
        type="submit"
        disabled={!pickup || !dropoff}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Request Ride
      </button>
    </form>
  )
}
