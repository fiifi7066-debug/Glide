import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { findBestMatch, findNearbyDrivers } from "@/lib/matching"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const { pickupLat, pickupLng } = await req.json()
    if (!pickupLat || !pickupLng) {
      return errorResponse("pickupLat and pickupLng required")
    }

    const drivers = await prisma.driver.findMany({
      where: {
        isAvailable: true,
        currentLat: { not: null },
        currentLng: { not: null },
      },
      include: {
        user: {
          select: { name: true, phone: true },
        },
      },
    })

    const withCoords = drivers.map((d) => ({
      id: d.id,
      userId: d.userId,
      name: d.user.name,
      phone: d.user.phone,
      vehicleModel: d.vehicleModel,
      vehicleColor: d.vehicleColor,
      licensePlate: d.licensePlate,
      rating: d.rating,
      totalTrips: d.totalTrips,
      distance: 0,
      currentLat: d.currentLat!,
      currentLng: d.currentLng!,
    }))

    const nearbyDrivers = findNearbyDrivers(withCoords, pickupLat, pickupLng)
    const matches = findBestMatch(pickupLat, pickupLng, nearbyDrivers)

    return successResponse(matches)
  } catch (error) {
    return errorResponse("Failed to find matches", 500)
  }
}
