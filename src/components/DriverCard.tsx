"use client"

import { FiStar } from "react-icons/fi"
import type { NearbyDriver } from "@/types"

interface DriverCardProps {
  driver: NearbyDriver
  onSelect?: (driver: NearbyDriver) => void
}

export default function DriverCard({ driver, onSelect }: DriverCardProps) {
  return (
    <div onClick={() => onSelect?.(driver)} className="glass-card rounded-xl p-4 hover:border-blue-500/30 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
          {driver.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-200 text-sm">{driver.name}</h4>
          <p className="text-xs text-gray-500 truncate">{driver.vehicleColor} {driver.vehicleModel}</p>
          <p className="text-xs text-gray-500 font-mono">{driver.licensePlate}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-500">
            <FiStar size={14} fill="currentColor" />
            <span className="text-sm font-medium text-gray-200">{driver.rating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-500">{driver.totalTrips} trips</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border/50">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>{driver.distance.toFixed(1)} km</span>
        </div>
        <span className="text-xs text-blue-400 font-medium">~{Math.round(driver.distance * 3)} min</span>
      </div>
    </div>
  )
}
