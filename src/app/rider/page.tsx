"use client"

import { useEffect, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import BookingForm from "@/components/BookingForm"
import MapView from "@/components/MapView"
import LiveTracker from "@/components/LiveTracker"
import RatingModal from "@/components/RatingModal"
import PaymentModal from "@/components/PaymentModal"
import DriverCard from "@/components/DriverCard"
import type { TripData, NearbyDriver } from "@/types"

export default function RiderDashboard() {
  const { user, activeTrip, setActiveTrip, nearbyDrivers, setNearbyDrivers } = useStore()
  const [searching, setSearching] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showNewRide, setShowNewRide] = useState(false)

  const fetchNearbyDrivers = useCallback(async () => {
    try { const res = await fetch("/api/drivers/nearby?lat=5.6037&lng=-0.1870"); if (res.ok) { const json = await res.json(); setNearbyDrivers(json.data || []) } } catch {}
  }, [setNearbyDrivers])

  const fetchActiveTrip = useCallback(async () => {
    try { const res = await fetch("/api/trips/active"); if (res.ok) { const json = await res.json(); if (json.data) setActiveTrip(json.data) } } catch {}
  }, [setActiveTrip])

  useEffect(() => { fetchNearbyDrivers(); fetchActiveTrip() }, [fetchNearbyDrivers, fetchActiveTrip])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (searching || (activeTrip && activeTrip.status !== "COMPLETED" && activeTrip.status !== "CANCELLED")) {
      interval = setInterval(fetchActiveTrip, 3000)
    }
    return () => clearInterval(interval)
  }, [searching, activeTrip, fetchActiveTrip])

  const handleRequestRide = async (data: { pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number; pickupAddress: string; dropoffAddress: string }) => {
    setSearching(true)
    try { const res = await fetch("/api/trips/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (res.ok) { const json = await res.json(); setActiveTrip(json.data) } } catch {}
    setSearching(false)
  }

  const handleRatingSubmit = (score: number, comment: string) => {
    if (!activeTrip) return
    fetch("/api/ratings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: activeTrip.id, score, comment, rateeId: activeTrip.driverId }) }).catch(() => {})
  }

  const handlePayment = (method: string) => {
    if (!activeTrip) return
    fetch("/api/payments/process", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: activeTrip.id, amount: activeTrip.fare, method }) }).catch(() => {})
  }

  const handleNewRide = () => { setActiveTrip(null); setShowNewRide(false) }

  const isTripActive = activeTrip && activeTrip.status !== "COMPLETED" && activeTrip.status !== "CANCELLED"
  const isTripCompleted = activeTrip?.status === "COMPLETED"

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Rider Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back, {user?.name || "Rider"}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {searching && !isTripActive && (
            <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up stagger-1 transition-all duration-200 hover:-translate-y-1">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">Searching for a driver...</h3>
              <p className="text-sm text-gray-400 mt-1">Please wait while we find a nearby driver</p>
            </div>
          )}

          {!isTripActive && !searching && activeTrip === null && <div className="animate-fade-in-up stagger-2"><BookingForm onRequestRide={handleRequestRide} /></div>}

          {isTripActive && activeTrip && <LiveTracker trip={activeTrip} />}

          {isTripCompleted && !showNewRide && (
            <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in-up stagger-3 transition-all duration-200 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-3xl text-green-400">&#10003;</span></div>
                <h3 className="text-lg font-bold text-white">Trip Completed!</h3>
                <p className="text-sm text-gray-400">How was your ride?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRating(true)} className="flex-1 py-2.5 border border-blue-500/30 text-blue-400 font-medium rounded-xl hover:bg-blue-500/10 transition-colors text-sm hover:scale-105 transition-transform">Rate Driver</button>
                <button onClick={() => setShowPayment(true)} className="flex-1 py-2.5 gradient-btn text-sm hover:scale-105 transition-transform">Pay GHS {activeTrip.fare}</button>
              </div>
              <button onClick={handleNewRide} className="w-full py-2.5 bg-dark-border text-gray-300 font-medium rounded-xl hover:bg-dark-border/80 transition-colors text-sm hover:scale-105 transition-transform">Request New Ride</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <MapView pickupLat={activeTrip?.pickupLat} pickupLng={activeTrip?.pickupLng} dropoffLat={activeTrip?.dropoffLat} dropoffLng={activeTrip?.dropoffLng} height="350px" />

          {nearbyDrivers.length > 0 && !isTripActive && (
            <div className="animate-fade-in-up stagger-4">
              <h3 className="text-lg font-bold text-white mb-3">Nearby Drivers</h3>
              <div className="space-y-3">
                {nearbyDrivers.slice(0, 3).map((driver: NearbyDriver) => <DriverCard key={driver.id} driver={driver} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <RatingModal isOpen={showRating} onClose={() => setShowRating(false)} onSubmit={handleRatingSubmit} targetName={activeTrip?.driver?.user?.name || "Driver"} targetRole="driver" />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} amount={activeTrip?.fare || 0} onProcess={handlePayment} />
    </div>
  )
}
