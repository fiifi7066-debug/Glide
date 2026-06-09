"use client"

interface MapViewProps {
  pickupLat?: number
  pickupLng?: number
  dropoffLat?: number
  dropoffLng?: number
  driverLat?: number
  driverLng?: number
  height?: string
}

export default function MapView({ pickupLat, pickupLng, dropoffLat, dropoffLng, driverLat, driverLng, height = "400px" }: MapViewProps) {
  const hasCoords = pickupLat !== undefined && pickupLng !== undefined

  const pickupStyle: Record<string, string> = hasCoords
    ? { left: `${((pickupLng! + 0.2) / 0.4) * 80 + 10}%`, top: `${((5.65 - pickupLat!) / 0.1) * 80 + 10}%` } : {}

  const dropoffStyle: Record<string, string> = dropoffLat !== undefined && dropoffLng !== undefined
    ? { left: `${((dropoffLng + 0.2) / 0.4) * 80 + 10}%`, top: `${((5.65 - dropoffLat) / 0.1) * 80 + 10}%` } : {}

  const driverStyle: Record<string, string> = driverLat !== undefined && driverLng !== undefined
    ? { left: `${((driverLng + 0.2) / 0.4) * 80 + 10}%`, top: `${((5.65 - driverLat) / 0.1) * 80 + 10}%` } : {}

  return (
    <div className="relative rounded-2xl overflow-hidden border border-dark-border/50" style={{ height }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950" />
      <div className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {hasCoords && (
        <>
          <div className="absolute w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-green-500/30 z-10" style={pickupStyle} title="Pickup">P</div>
          {dropoffLat !== undefined && <div className="absolute w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/30 z-10" style={dropoffStyle} title="Dropoff">D</div>}
          {driverLat !== undefined && (
            <div className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 z-20" style={driverStyle} title="Driver">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="white">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-dark-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow text-xs text-gray-300 flex items-center gap-3 border border-dark-border/50">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Pickup</span>
            {dropoffLat !== undefined && <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full inline-block" /> Dropoff</span>}
            {driverLat !== undefined && <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block" /> Driver</span>}
          </div>
        </>
      )}

      {!hasCoords && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-500 font-medium">Map View</p>
            <p className="text-gray-500 text-sm">Enter locations to see route</p>
          </div>
        </div>
      )}
    </div>
  )
}
