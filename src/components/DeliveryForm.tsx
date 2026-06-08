"use client"

import { useState } from "react"
import { FiPackage, FiMapPin } from "react-icons/fi"

interface DeliveryFormProps {
  onRequestDelivery: (data: {
    pickupLat: number
    pickupLng: number
    dropoffLat: number
    dropoffLng: number
    pickupAddress: string
    dropoffAddress: string
    parcelDescription: string
    parcelWeight: number
  }) => void
}

const MOCK_PICKUP = { lat: 5.6037, lng: -0.1870, address: "123 Independence Ave, Accra" }
const MOCK_DROPOFF = { lat: 5.6500, lng: -0.1900, address: "456 Liberation Road, Accra" }

export default function DeliveryForm({ onRequestDelivery }: DeliveryFormProps) {
  const [pickup, setPickup] = useState(MOCK_PICKUP.address)
  const [dropoff, setDropoff] = useState(MOCK_DROPOFF.address)
  const [description, setDescription] = useState("")
  const [weight, setWeight] = useState<number>(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff || !description) return
    onRequestDelivery({
      pickupLat: MOCK_PICKUP.lat,
      pickupLng: MOCK_PICKUP.lng,
      dropoffLat: MOCK_DROPOFF.lat,
      dropoffLng: MOCK_DROPOFF.lng,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      parcelDescription: description,
      parcelWeight: weight,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Send a Package</h2>

      <div className="space-y-3">
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
          <input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Description</label>
        <textarea
          placeholder="Describe the package..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!pickup || !dropoff || !description}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Request Delivery
      </button>
    </form>
  )
}
