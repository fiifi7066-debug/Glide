import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { haversineDistance } from "@/lib/geo"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = parseFloat(searchParams.get("lat") || "0")
    const lng = parseFloat(searchParams.get("lng") || "0")
    const radius = parseFloat(searchParams.get("radius") || "10")

    if (!lat || !lng) {
      return errorResponse("lat and lng query params required")
    }

    const drivers = await prisma.driver.findMany({
      where: {
        isAvailable: true,
        currentLat: { not: null },
        currentLng: { not: null },
      },
      include: {
        user: {
          select: { name: true, phone: true, avatar: true },
        },
      },
    })

    const nearby = drivers
      .map((d) => {
        const distance = haversineDistance(lat, lng, d.currentLat!, d.currentLng!)
        return {
          id: d.id,
          userId: d.userId,
          name: d.user.name,
          phone: d.user.phone,
          vehicleModel: d.vehicleModel,
          vehicleColor: d.vehicleColor,
          licensePlate: d.licensePlate,
          rating: d.rating,
          totalTrips: d.totalTrips,
          currentLat: d.currentLat!,
          currentLng: d.currentLng!,
          distance,
        }
      })
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return successResponse(nearby)
  } catch (error) {
    return errorResponse("Failed to get nearby drivers", 500)
  }
}
