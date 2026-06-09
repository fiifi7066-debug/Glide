"use client"

import { useEffect, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import RideCard from "@/components/RideCard"
import DeliveryCard from "@/components/DeliveryCard"
import type { TripData, DeliveryData } from "@/types"

type Tab = "rides" | "deliveries"
type Filter = "ALL" | "COMPLETED" | "CANCELLED"

export default function HistoryPage() {
  const { tripHistory, setTripHistory, deliveryHistory, setDeliveryHistory } = useStore()
  const [tab, setTab] = useState<Tab>("rides")
  const [filter, setFilter] = useState<Filter>("ALL")
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const [tripsRes, deliveriesRes] = await Promise.all([fetch("/api/trips/history"), fetch("/api/deliveries/history")])
      if (tripsRes.ok) { const json = await tripsRes.json(); setTripHistory(json.data || []) }
      if (deliveriesRes.ok) { const json = await deliveriesRes.json(); setDeliveryHistory(json.data || []) }
    } catch {}
    setLoading(false)
  }, [setTripHistory, setDeliveryHistory])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const filteredTrips = tripHistory.filter((t: TripData) => filter === "ALL" || t.status === filter)
  const filteredDeliveries = deliveryHistory.filter((d: DeliveryData) => filter === "ALL" || d.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">History</h1>

      <div className="flex gap-2 mb-6 animate-fade-in-up stagger-1">
        {(["rides", "deliveries"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${tab === t ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-dark-card text-gray-400 hover:bg-dark-border"}`}>
            {t === "rides" ? "Rides" : "Deliveries"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6 animate-fade-in-up stagger-2">
        {(["ALL", "COMPLETED", "CANCELLED"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${filter === f ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-dark-card text-gray-500 border border-dark-border hover:border-gray-600"}`}>
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
        ) : tab === "rides" ? (
          filteredTrips.length > 0 ? (
            <div className="space-y-4 animate-fade-in-up stagger-3">{filteredTrips.map((trip: TripData) => <RideCard key={trip.id} trip={trip} showActions={false} />)}</div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center animate-fade-in-up stagger-3 transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">&#128663;</span></div>
            <h3 className="text-lg font-semibold text-white mb-1">No rides yet</h3>
            <p className="text-sm text-gray-400">Your ride history will appear here</p>
          </div>
        )
        ) : filteredDeliveries.length > 0 ? (
          <div className="space-y-4 animate-fade-in-up stagger-3">{filteredDeliveries.map((delivery: DeliveryData) => <DeliveryCard key={delivery.id} delivery={delivery} role="RIDER" />)}</div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center animate-fade-in-up stagger-3 transition-all duration-200 hover:-translate-y-1">
          <div className="w-16 h-16 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">&#128230;</span></div>
          <h3 className="text-lg font-semibold text-white mb-1">No deliveries yet</h3>
          <p className="text-sm text-gray-400">Your delivery history will appear here</p>
        </div>
      )}
    </div>
  )
}
