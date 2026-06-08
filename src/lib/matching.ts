import type { NearbyDriver, MatchResult } from "@/types"
import { haversineDistance, estimateDuration } from "./geo"

interface DriverScore {
  driverId: string
  distance: number
  rating: number
  totalTrips: number
  isAvailable: boolean
}

export function scoreDriver(driver: DriverScore): number {
  const distanceScore = Math.max(0, 100 - driver.distance * 10)
  const ratingScore = driver.rating * 10
  const experienceScore = Math.min(20, driver.totalTrips * 2)
  const availabilityScore = driver.isAvailable ? 50 : -200
  return distanceScore + ratingScore + experienceScore + availabilityScore
}

export function findBestMatch(
  pickupLat: number,
  pickupLng: number,
  nearbyDrivers: NearbyDriver[],
  maxResults: number = 3
): MatchResult[] {
  const scored = nearbyDrivers
    .map((d) => ({
      driverId: d.id,
      score: scoreDriver({
        driverId: d.id,
        distance: d.distance,
        rating: d.rating,
        totalTrips: d.totalTrips,
        isAvailable: true,
      }),
      distance: d.distance,
      eta: estimateDuration(d.distance),
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, maxResults)
}

export function findNearbyDrivers(
  drivers: (NearbyDriver & { currentLat: number; currentLng: number })[],
  pickupLat: number,
  pickupLng: number,
  radiusKm: number = 10
): NearbyDriver[] {
  return drivers
    .filter((d) => {
      const dist = haversineDistance(
        pickupLat,
        pickupLng,
        d.currentLat,
        d.currentLng
      )
      return dist <= radiusKm
    })
    .map((d) => ({
      ...d,
      distance: haversineDistance(
        pickupLat,
        pickupLng,
        d.currentLat,
        d.currentLng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
}
