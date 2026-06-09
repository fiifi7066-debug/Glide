"use client"

import { useEffect, useRef, useState } from "react"

interface Location {
  name: string
  lat: number
  lng: number
  region: string
  description?: string
  category: "capital" | "city" | "landmark" | "nature" | "coastal"
}

const LOCATIONS: Location[] = [
  // National Capital
  { name: "Accra", lat: 5.6037, lng: -0.1870, region: "Greater Accra", description: "Capital and largest city of Ghana", category: "capital" },

  // Regional Capitals
  { name: "Kumasi", lat: 6.6885, lng: -1.6244, region: "Ashanti", description: "Historic capital of the Ashanti Kingdom", category: "capital" },
  { name: "Tamale", lat: 9.4034, lng: -0.8393, region: "Northern", description: "Fastest-growing city in West Africa", category: "capital" },
  { name: "Sekondi-Takoradi", lat: 4.9185, lng: -1.7709, region: "Western", description: "Oil and gas hub of Ghana", category: "capital" },
  { name: "Cape Coast", lat: 5.1066, lng: -1.2461, region: "Central", description: "Historic slave trade center", category: "capital" },
  { name: "Ho", lat: 6.5963, lng: 0.4713, region: "Volta", description: "Capital of Volta Region", category: "capital" },
  { name: "Sunyani", lat: 7.3389, lng: -2.3269, region: "Bono", description: "Capital of Bono Region", category: "capital" },
  { name: "Wa", lat: 10.0585, lng: -2.4885, region: "Upper West", description: "Capital of Upper West Region", category: "capital" },
  { name: "Bolgatanga", lat: 10.7856, lng: -0.8514, region: "Upper East", description: "Capital of Upper East Region", category: "capital" },
  { name: "Koforidua", lat: 6.0886, lng: -0.2586, region: "Eastern", description: "Capital of Eastern Region", category: "capital" },
  { name: "Goaso", lat: 6.8015, lng: -2.5196, region: "Ahafo", description: "Capital of Ahafo Region", category: "capital" },
  { name: "Nalerigu", lat: 10.5300, lng: -0.3640, region: "North East", description: "Capital of North East Region", category: "capital" },
  { name: "Damongo", lat: 9.0800, lng: -1.8200, region: "Savannah", description: "Capital of Savannah Region", category: "capital" },
  { name: "Sefwi Wiawso", lat: 6.2200, lng: -2.4800, region: "Western North", description: "Capital of Western North Region", category: "capital" },
  { name: "Dambai", lat: 8.0600, lng: 0.1800, region: "Oti", description: "Capital of Oti Region", category: "capital" },
  { name: "Techiman", lat: 7.5910, lng: -1.9394, region: "Bono East", description: "Capital of Bono East Region", category: "capital" },

  // Major Cities
  { name: "Tema", lat: 5.6697, lng: -0.0166, region: "Greater Accra", description: "Ghana's largest seaport and industrial city", category: "city" },
  { name: "Obuasi", lat: 6.2064, lng: -1.6889, region: "Ashanti", description: "Major gold mining center", category: "city" },
  { name: "Tarkwa", lat: 5.3064, lng: -1.9904, region: "Western", description: "Gold and manganese mining town", category: "city" },

  // Historic Landmarks
  { name: "Elmina Castle", lat: 5.0820, lng: -1.3492, region: "Central", description: "Oldest European building in sub-Saharan Africa (UNESCO)", category: "landmark" },
  { name: "Larabanga Mosque", lat: 9.2153, lng: -1.8623, region: "Savannah", description: "Oldest mosque in Ghana, built in 1421", category: "landmark" },
  { name: "Manhyia Palace", lat: 6.7015, lng: -1.6179, region: "Ashanti", description: "Official residence of the Asantehene", category: "landmark" },
  { name: "Kwame Nkrumah Mausoleum", lat: 5.5457, lng: -0.2070, region: "Greater Accra", description: "Resting place of Ghana's first president", category: "landmark" },
  { name: "Fort Jesus", lat: 5.5380, lng: -0.1950, region: "Greater Accra", description: "17th-century Danish fort at Osu", category: "landmark" },

  // Natural Wonders
  { name: "Lake Volta", lat: 6.5000, lng: -0.1000, region: "Volta", description: "World's largest man-made lake by surface area", category: "nature" },
  { name: "Mole National Park", lat: 9.7000, lng: -1.8333, region: "Savannah", description: "Ghana's largest wildlife refuge", category: "nature" },
  { name: "Kakum National Park", lat: 5.3833, lng: -1.3833, region: "Central", description: "Famous for its canopy walkway", category: "nature" },
  { name: "Wli Waterfalls", lat: 7.1255, lng: 0.5921, region: "Volta", description: "Highest waterfall in West Africa", category: "nature" },
  { name: "Boti Falls", lat: 6.1742, lng: -0.2235, region: "Eastern", description: "Twin waterfall with a legendary umbrella rock", category: "nature" },
  { name: "Shai Hills Reserve", lat: 5.9025, lng: -0.0493, region: "Greater Accra", description: "Game reserve with baboons and antelopes", category: "nature" },

  // Coastal & Beaches
  { name: "Labadi Beach", lat: 5.5494, lng: -0.1574, region: "Greater Accra", description: "Popular beach with vibrant atmosphere", category: "coastal" },
  { name: "Kokrobite Beach", lat: 5.4890, lng: -0.2810, region: "Greater Accra", description: "Surfing and reggae beach town", category: "coastal" },
  { name: "Busua Beach", lat: 4.8056, lng: -1.9347, region: "Western", description: "Beautiful white sand beach with resorts", category: "coastal" },
  { name: "Ada Foah", lat: 5.7800, lng: 0.6318, region: "Greater Accra", description: "Estuary town where Volta meets the Atlantic", category: "coastal" },
]

const CATEGORY_COLORS: Record<string, string> = {
  capital: "#ef4444",
  city: "#f59e0b",
  landmark: "#8b5cf6",
  nature: "#22c55e",
  coastal: "#06b6d4",
}

const CATEGORY_LABELS: Record<string, string> = {
  capital: "Regional Capital",
  city: "Major City",
  landmark: "Historic Landmark",
  nature: "Natural Wonder",
  coastal: "Coastal",
}

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(LOCATIONS.length)

  const filteredLocations = activeCategory
    ? LOCATIONS.filter((l) => l.category === activeCategory)
    : LOCATIONS

  useEffect(() => {
    setVisibleCount(filteredLocations.length)
  }, [filteredLocations.length])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let map: any, L: any

    async function init() {
      const mod = await import("leaflet")
      L = mod.default

      map = L.map(containerRef.current, {
        center: [8.0300, -1.0800],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: ["a", "b", "c", "d"],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map)

      filteredLocations.forEach((loc) => {
        const color = CATEGORY_COLORS[loc.category]
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:28px;height:28px;background:${color};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;box-shadow:0 2px 8px ${color}60;">${loc.category === "capital" ? "★" : "●"}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map)
        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif;min-width:200px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block"></span>
              <span style="font-size:11px;color:${color};font-weight:600;text-transform:uppercase">${CATEGORY_LABELS[loc.category]}</span>
            </div>
            <h3 style="margin:0 0 2px;font-size:16px;font-weight:700;color:#1e293b">${loc.name}</h3>
            <p style="margin:0 0 2px;font-size:12px;color:#64748b">${loc.region} Region</p>
            <p style="margin:0 0 4px;font-size:13px;color:#475569">${loc.description || ""}</p>
            <p style="margin:0;font-size:11px;color:#94a3b8">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p>
          </div>
        `)
      })

      const group = L.featureGroup(
        filteredLocations.map((loc) => L.marker([loc.lat, loc.lng]))
      )
      map.fitBounds(group.getBounds().pad(0.08))
    }
    init()

    return () => {
      if (map) { map.remove(); mapRef.current = null }
    }
  }, [activeCategory, filteredLocations])

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Map of Ghana</h1>
            <p className="text-sm text-gray-400">{visibleCount} of {LOCATIONS.length} locations across 16 regions</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeCategory ? "bg-blue-600 text-white" : "bg-dark-card text-gray-400 hover:text-gray-200 border border-dark-border"}`}>
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === key ? "bg-blue-600 text-white" : "bg-dark-card text-gray-400 hover:text-gray-200 border border-dark-border"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="w-full rounded-2xl overflow-hidden border border-dark-border/50 shadow-2xl"
          style={{ height: "calc(100vh - 200px)", minHeight: "500px" }} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 mt-3">
          {filteredLocations.map((loc) => (
            <div key={loc.name} className="glass-card rounded-lg px-2.5 py-1.5 text-xs cursor-pointer hover:border-blue-500/40 transition-all"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView([loc.lat, loc.lng], 10, { animate: true })
                  setTimeout(() => {
                    mapRef.current.eachLayer((layer: any) => {
                      if (layer.getLatLng && Math.abs(layer.getLatLng().lat - loc.lat) < 0.01 && Math.abs(layer.getLatLng().lng - loc.lng) < 0.01) {
                        layer.openPopup()
                      }
                    })
                  }, 400)
                }
              }}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: CATEGORY_COLORS[loc.category] }} />
                <span className="font-medium text-gray-200 truncate">{loc.name}</span>
              </span>
              <span className="text-gray-500 block truncate">{loc.region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
