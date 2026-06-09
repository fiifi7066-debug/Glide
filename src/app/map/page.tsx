"use client"

import { useEffect, useRef } from "react"

interface Location {
  name: string
  lat: number
  lng: number
  description?: string
}

const LOCATIONS: Location[] = [
  { name: "Independence Arch", lat: 5.5471, lng: -0.1924, description: "Iconic landmark in Black Star Square" },
  { name: "Kwame Nkrumah Memorial Park", lat: 5.5457, lng: -0.2070, description: "Mausoleum and museum dedicated to Ghana's first president" },
  { name: "Makola Market", lat: 5.5444, lng: -0.2100, description: "One of the largest markets in Accra" },
  { name: "Labadi Beach", lat: 5.5494, lng: -0.1574, description: "Popular beach along the Atlantic coast" },
  { name: "University of Ghana", lat: 5.6512, lng: -0.1884, description: "Premier university in Legon" },
  { name: "Accra Mall", lat: 5.6278, lng: -0.1756, description: "Modern shopping center at Tetteh Quarshie" },
  { name: "Kotoka International Airport", lat: 5.6037, lng: -0.1870, description: "Main international airport serving Accra" },
  { name: "Osu Castle", lat: 5.5418, lng: -0.1869, description: "Historic castle and former seat of government" },
  { name: "W.E.B. Du Bois Center", lat: 5.5829, lng: -0.1834, description: "Museum honoring the African-American scholar" },
  { name: "National Theatre", lat: 5.5480, lng: -0.1997, description: "Iconic performing arts venue" },
]

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let map: any, L: any

    async function init() {
      const mod = await import("leaflet")
      L = mod.default

      map = L.map(containerRef.current, {
        center: [5.6037, -0.1870],
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: ["a", "b", "c", "d"],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map)

      LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map)
        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif;min-width:180px">
            <h3 style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1e293b">${loc.name}</h3>
            <p style="margin:0 0 6px;font-size:13px;color:#64748b">${loc.description || ""}</p>
            <p style="margin:0;font-size:11px;color:#94a3b8">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p>
          </div>
        `)
      })

      const group = L.featureGroup(
        LOCATIONS.map((loc) => L.marker([loc.lat, loc.lng]))
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }
    init()

    return () => {
      if (map) map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Accra Map</h1>
            <p className="text-sm text-gray-400">{LOCATIONS.length} locations pinned</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block animate-pulse" />
            Interactive Map
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full rounded-2xl overflow-hidden border border-dark-border/50 shadow-2xl"
          style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="glass-card rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-blue-500/40 transition-all"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView([loc.lat, loc.lng], 15, { animate: true })
                  setTimeout(() => {
                    mapRef.current.eachLayer((layer: any) => {
                      if (layer.getLatLng && layer.getLatLng().lat === loc.lat && layer.getLatLng().lng === loc.lng) {
                        layer.openPopup()
                      }
                    })
                  }, 400)
                }
              }}
            >
              <span className="font-medium text-gray-200 block truncate">{loc.name}</span>
              <span className="text-gray-500">{loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
