"use client"

import { useEffect, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import RideCard from "@/components/RideCard"
import DeliveryCard from "@/components/DeliveryCard"
import type { TripData, DeliveryData } from "@/types"

type Tab = "rides" | "deliveries"
type Filter = "ALL" | "COMPLETED" | "CANCELLED"

export default function HistoryPage() {
  const {
    tripHistory,
    setTripHistory,
    deliveryHistory,
    setDeliveryHistory,
  } = useStore()

  const [tab, setTab] = useState<Tab>("rides")
  const [filter, setFilter] = useState<Filter>("ALL")
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const [tripsRes, deliveriesRes] = await Promise.all([
        fetch("/api/trips/history"),
        fetch("/api/deliveries/history"),
      ])
      if (tripsRes.ok) {
        const json = await tripsRes.json()
        setTripHistory(json.data || [])
      }
      if (deliveriesRes.ok) {
        const json = await deliveriesRes.json()
        setDeliveryHistory(json.data || [])
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [setTripHistory, setDeliveryHistory])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const filteredTrips = tripHistory.filter((t: TripData) => {
    if (filter === "ALL") return true
    return t.status === filter
  })

  const filteredDeliveries = deliveryHistory.filter((d: DeliveryData) => {
    if (filter === "ALL") return true
    return d.status === filter
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("rides")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "rides"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Rides
        </button>
        <button
          onClick={() => setTab("deliveries")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "deliveries"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Deliveries
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["ALL", "COMPLETED", "CANCELLED"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : tab === "rides" ? (
        filteredTrips.length > 0 ? (
          <div className="space-y-4">
            {filteredTrips.map((trip: TripData) => (
              <RideCard key={trip.id} trip={trip} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">&#128663;</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No rides yet
            </h3>
            <p className="text-sm text-gray-500">
              Your ride history will appear here
            </p>
          </div>
        )
      ) : filteredDeliveries.length > 0 ? (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery: DeliveryData) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              role="RIDER"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">&#128230;</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No deliveries yet
          </h3>
          <p className="text-sm text-gray-500">
            Your delivery history will appear here
          </p>
        </div>
      )}
    </div>
  )
}
