"use client"

import { useEffect, useRef, useState } from "react"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let map: any, L: any

    async function init() {
      const mod = await import("leaflet")
      L = mod.default

      map = L.map(containerRef.current, {
        center: [5.6037, -0.1870],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: ["a", "b", "c", "d"],
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: "bottomright" }).addTo(map)
      setReady(true)
    }
    init()

    return () => {
      if (map) map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return

    async function updateMarkers() {
      const L = await import("leaflet")

      const map = mapRef.current
      markersRef.current.forEach((m: any) => map.removeLayer(m))
      markersRef.current = []

      const markers: any[] = []

      if (pickupLat !== undefined && pickupLng !== undefined) {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:32px;height:32px;background:#22c55e;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 12px rgba(34,197,94,0.5);">P</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
        const m = L.marker([pickupLat, pickupLng], { icon }).addTo(map).bindPopup("Pickup Location")
        markers.push(m)
      }

      if (dropoffLat !== undefined && dropoffLng !== undefined) {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:32px;height:32px;background:#ef4444;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 12px rgba(239,68,68,0.5);">D</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
        const m = L.marker([dropoffLat, dropoffLng], { icon }).addTo(map).bindPopup("Dropoff Location")
        markers.push(m)
      }

      if (driverLat !== undefined && driverLng !== undefined) {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:36px;height:36px;background:#3b82f6;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(59,130,246,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
        const m = L.marker([driverLat, driverLng], { icon }).addTo(map).bindPopup("Driver")
        markers.push(m)
      }

      markersRef.current = markers

      if (markers.length > 0) {
        const group = L.featureGroup(markers)
        map.fitBounds(group.getBounds().pad(0.15))
      }
    }
    updateMarkers()
  }, [ready, pickupLat, pickupLng, dropoffLat, dropoffLng, driverLat, driverLng])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-dark-border/50 z-0" style={{ height }}>
      <style>{`
        .custom-marker { background: none !important; border: none !important; }
        .leaflet-container { background: #0B1120 !important; }
        .leaflet-popup-content-wrapper { background: #1E293B !important; color: #e2e8f0 !important; border-radius: 12px !important; border: 1px solid #334155 !important; box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .leaflet-popup-tip { background: #1E293B !important; border: 1px solid #334155 !important; }
        .leaflet-control-zoom a { background: #1E293B !important; color: #e2e8f0 !important; border-color: #334155 !important; }
        .leaflet-control-zoom a:hover { background: #334155 !important; }
      `}</style>
    </div>
    </>
  )
}
