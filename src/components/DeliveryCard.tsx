"use client"

import type { DeliveryData } from "@/types"

interface DeliveryCardProps {
  delivery: DeliveryData
  onAction?: (action: string) => void
  role: "RIDER" | "DRIVER"
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ACCEPTED: "bg-blue-100 text-blue-800 border-blue-200",
  PICKED_UP: "bg-indigo-100 text-indigo-800 border-indigo-200",
  IN_TRANSIT: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
}

const STAGES = ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"] as const

export default function DeliveryCard({ delivery, onAction, role }: DeliveryCardProps) {
  const currentStageIndex = STAGES.indexOf(delivery.status as typeof STAGES[number])

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[delivery.status] || "bg-gray-100 text-gray-600"}`}
          >
            {delivery.status.replace("_", " ")}
          </span>
        </div>
        {delivery.fare !== null && delivery.fare !== undefined && (
          <span className="text-lg font-bold text-primary">GHS {delivery.fare}</span>
        )}
      </div>

      <div className="mb-3 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-start gap-2">
          <FiPackageIcon />
          <div>
            <p className="text-sm font-medium text-gray-800">{delivery.parcelDescription}</p>
            {delivery.parcelWeight !== null && delivery.parcelWeight !== undefined && (
              <p className="text-xs text-gray-400">{delivery.parcelWeight} kg</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
          <p className="text-xs text-gray-600">{delivery.pickupAddress}</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <p className="text-xs text-gray-600">{delivery.dropoffAddress}</p>
        </div>
      </div>

      {currentStageIndex >= 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStageIndex
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < currentStageIndex ? "✓" : i + 1}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                  {stage.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-1">
            <div className="absolute top-0 left-2.5 right-2.5 h-0.5 bg-gray-200" />
            <div
              className="absolute top-0 left-2.5 h-0.5 bg-primary transition-all"
              style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {delivery.status === "REQUESTED" && role === "DRIVER" && onAction && (
        <button
          onClick={() => onAction("accept")}
          className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl text-sm hover:shadow-lg transition-all"
        >
          Accept Delivery
        </button>
      )}

      {(delivery.status === "ACCEPTED" || delivery.status === "PICKED_UP" || delivery.status === "IN_TRANSIT") && role === "RIDER" && (
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          {delivery.status === "ACCEPTED" ? "Driver heading to pickup" : delivery.status === "PICKED_UP" ? "Package picked up" : "Package in transit"}
        </div>
      )}
    </div>
  )
}

function FiPackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 16h6M16 8h6M4 16h6M4 8h6M2 4h20v16H2V4z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  )
}
