"use client"

import { useEffect, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import RideCard from "@/components/RideCard"
import DeliveryCard from "@/components/DeliveryCard"
import MapView from "@/components/MapView"
import LiveTracker from "@/components/LiveTracker"
import type { TripData, DeliveryData } from "@/types"

export default function DriverDashboard() {
  const {
    user,
    activeTrip,
    setActiveTrip,
    activeDelivery,
    setActiveDelivery,
    pendingRequests,
    setPendingRequests,
    pendingDeliveries,
    setPendingDeliveries,
    driverLocation,
    setDriverLocation,
  } = useStore()

  const [isAvailable, setIsAvailable] = useState(true)
  const [showMap, setShowMap] = useState(false)

  const toggleAvailability = async () => {
    const next = !isAvailable
    setIsAvailable(next)
  }

  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/trips/active")
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setActiveTrip(json.data)
        }
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/trips/history")
      if (res.ok) {
        const json = await res.json()
        const all = json.data || []
        const pending = all.filter((t: TripData) => t.status === "REQUESTED")
        setPendingRequests(pending)
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/deliveries/active")
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setActiveDelivery(json.data)
        }
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/deliveries/history")
      if (res.ok) {
        const json = await res.json()
        const all = json.data || []
        const pending = all.filter(
          (d: DeliveryData) => d.status === "REQUESTED"
        )
        setPendingDeliveries(pending)
      }
    } catch {
      // ignore
    }
  }, [
    setActiveTrip,
    setActiveDelivery,
    setPendingRequests,
    setPendingDeliveries,
  ])

  useEffect(() => {
    fetchPendingRequests()
  }, [fetchPendingRequests])

  useEffect(() => {
    const interval = setInterval(fetchPendingRequests, 5000)
    return () => clearInterval(interval)
  }, [fetchPendingRequests])

  useEffect(() => {
    if (!showMap) return
    const interval = setInterval(() => {
      const lat = 5.6037 + (Math.random() - 0.5) * 0.02
      const lng = -0.1870 + (Math.random() - 0.5) * 0.02
      setDriverLocation({ lat, lng })
    }, 3000)
    return () => clearInterval(interval)
  }, [showMap, setDriverLocation])

  const handleAcceptTrip = async (trip: TripData) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/accept`, {
        method: "PATCH",
      })
      if (res.ok) {
        const json = await res.json()
        setActiveTrip(json.data)
        const filtered = useStore
          .getState()
          .pendingRequests.filter((t) => t.id !== trip.id)
        setPendingRequests(filtered)
      }
    } catch {
      // ignore
    }
  }

  const handleStartTrip = async () => {
    if (!activeTrip) return
    try {
      const res = await fetch(`/api/trips/${activeTrip.id}/start`, {
        method: "PATCH",
      })
      if (res.ok) {
        const json = await res.json()
        setActiveTrip(json.data)
      }
    } catch {
      // ignore
    }
  }

  const handleCompleteTrip = async () => {
    if (!activeTrip) return
    try {
      const res = await fetch(`/api/trips/${activeTrip.id}/complete`, {
        method: "PATCH",
      })
      if (res.ok) {
        const json = await res.json()
        setActiveTrip(json.data)
      }
    } catch {
      // ignore
    }
  }

  const handleAcceptDelivery = async (delivery: DeliveryData) => {
    try {
      const res = await fetch(`/api/deliveries/${delivery.id}/accept`, {
        method: "PATCH",
      })
      if (res.ok) {
        const json = await res.json()
        setActiveDelivery(json.data)
        const filtered = useStore
          .getState()
          .pendingDeliveries.filter((d) => d.id !== delivery.id)
        setPendingDeliveries(filtered)
      }
    } catch {
      // ignore
    }
  }

  const isOnTrip =
    activeTrip &&
    activeTrip.status !== "COMPLETED" &&
    activeTrip.status !== "CANCELLED"
  const isOnDelivery =
    activeDelivery &&
    activeDelivery.status !== "DELIVERED" &&
    activeDelivery.status !== "CANCELLED"

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Driver Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome, {user?.name || "Driver"}
          </p>
        </div>
        <button
          onClick={toggleAvailability}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
            isAvailable
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {isAvailable ? "Online" : "Offline"}
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {isAvailable && !isOnTrip && !isOnDelivery && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128663;</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Waiting for ride requests...
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                New trips and deliveries will appear here
              </p>
            </div>
          )}

          {isOnTrip && activeTrip && (
            <div className="space-y-4">
              <LiveTracker trip={activeTrip} />
              {activeTrip.status === "ACCEPTED" && (
                <button
                  onClick={handleStartTrip}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Start Trip
                </button>
              )}
              {activeTrip.status === "STARTED" && (
                <button
                  onClick={handleCompleteTrip}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Complete Trip
                </button>
              )}
            </div>
          )}

          {isOnDelivery && activeDelivery && (
            <div className="space-y-4">
              <LiveTracker delivery={activeDelivery} />
            </div>
          )}

          {!isOnTrip &&
            !isOnDelivery &&
            pendingRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Pending Ride Requests
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((trip: TripData) => (
                    <RideCard
                      key={trip.id}
                      trip={trip}
                      onAction={() => handleAcceptTrip(trip)}
                    />
                  ))}
                </div>
              </div>
            )}

          {!isOnTrip &&
            !isOnDelivery &&
            pendingDeliveries.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Pending Deliveries
                </h3>
                <div className="space-y-3">
                  {pendingDeliveries.map((delivery: DeliveryData) => (
                    <DeliveryCard
                      key={delivery.id}
                      delivery={delivery}
                      role="DRIVER"
                      onAction={() => handleAcceptDelivery(delivery)}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Live Map</h3>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-sm text-primary hover:underline"
            >
              {showMap ? "Hide" : "Show"}
            </button>
          </div>
          {showMap && (
            <MapView
              pickupLat={
                activeTrip?.pickupLat || activeDelivery?.pickupLat
              }
              pickupLng={
                activeTrip?.pickupLng || activeDelivery?.pickupLng
              }
              dropoffLat={
                activeTrip?.dropoffLat || activeDelivery?.dropoffLat
              }
              dropoffLng={
                activeTrip?.dropoffLng || activeDelivery?.dropoffLng
              }
              driverLat={driverLocation?.lat}
              driverLng={driverLocation?.lng}
              height="400px"
            />
          )}
        </div>
      </div>
    </div>
  )
}
