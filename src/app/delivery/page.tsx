"use client"

import { useEffect, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import DeliveryForm from "@/components/DeliveryForm"
import DeliveryCard from "@/components/DeliveryCard"
import LiveTracker from "@/components/LiveTracker"
import MapView from "@/components/MapView"
import type { DeliveryData } from "@/types"

export default function DeliveryPage() {
  const {
    user,
    isDriver,
    activeDelivery,
    setActiveDelivery,
    pendingDeliveries,
    setPendingDeliveries,
  } = useStore()

  const [searching, setSearching] = useState(false)

  const fetchActiveDelivery = useCallback(async () => {
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

    if (isDriver) {
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
    }
  }, [setActiveDelivery, setPendingDeliveries, isDriver])

  useEffect(() => {
    fetchActiveDelivery()
  }, [fetchActiveDelivery])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (
      searching ||
      (activeDelivery &&
        activeDelivery.status !== "DELIVERED" &&
        activeDelivery.status !== "CANCELLED")
    ) {
      interval = setInterval(fetchActiveDelivery, 3000)
    }
    return () => clearInterval(interval)
  }, [searching, activeDelivery, fetchActiveDelivery])

  const handleRequestDelivery = async (data: {
    pickupLat: number
    pickupLng: number
    dropoffLat: number
    dropoffLng: number
    pickupAddress: string
    dropoffAddress: string
    parcelDescription: string
    parcelWeight: number
  }) => {
    setSearching(true)
    try {
      const res = await fetch("/api/deliveries/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const json = await res.json()
        setActiveDelivery(json.data)
      }
    } catch {
      // ignore
    }
    setSearching(false)
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

  const isActiveDelivery =
    activeDelivery &&
    activeDelivery.status !== "DELIVERED" &&
    activeDelivery.status !== "CANCELLED"

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Delivery</h1>
        <p className="text-gray-500 text-sm">
          {isDriver ? "Available delivery requests" : "Send a package"}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!isDriver && !isActiveDelivery && !searching && (
            <DeliveryForm onRequestDelivery={handleRequestDelivery} />
          )}

          {searching && !isActiveDelivery && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Searching for a driver...
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please wait while we find a nearby driver
              </p>
            </div>
          )}

          {isActiveDelivery && <LiveTracker delivery={activeDelivery} />}

          {activeDelivery?.status === "DELIVERED" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">&#10003;</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Package Delivered!
              </h3>
              <p className="text-sm text-gray-500">
                Your package has been delivered successfully
              </p>
              <button
                onClick={() => setActiveDelivery(null)}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm"
              >
                Send Another Package
              </button>
            </div>
          )}

          {isDriver &&
            pendingDeliveries.length > 0 &&
            !isActiveDelivery && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Available Deliveries
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

          {isDriver &&
            pendingDeliveries.length === 0 &&
            !isActiveDelivery && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">&#128230;</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  No delivery requests
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Check back later for new delivery opportunities
                </p>
              </div>
            )}
        </div>

        <div className="lg:col-span-3">
          <MapView
            pickupLat={activeDelivery?.pickupLat}
            pickupLng={activeDelivery?.pickupLng}
            dropoffLat={activeDelivery?.dropoffLat}
            dropoffLng={activeDelivery?.dropoffLng}
            height="400px"
          />
        </div>
      </div>
    </div>
  )
}
