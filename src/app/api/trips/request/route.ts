import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { haversineDistance, calculateFare, estimateDuration } from "@/lib/geo"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }
    if (user.role !== "RIDER") {
      return errorResponse("Only riders can request trips", 403)
    }

    const rider = await prisma.rider.findUnique({ where: { userId: user.id } })
    if (!rider) {
      return errorResponse("Rider profile not found", 404)
    }

    const { pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress } = await req.json()

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng || !pickupAddress || !dropoffAddress) {
      return errorResponse("Missing required fields")
    }

    const distance = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng)
    const duration = estimateDuration(distance)
    const fare = calculateFare(distance, duration)

    const trip = await prisma.trip.create({
      data: {
        riderId: rider.id,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        pickupAddress,
        dropoffAddress,
        status: "REQUESTED",
        fare,
        distance,
        duration,
      },
    })

    return successResponse(trip, 201)
  } catch (error) {
    return errorResponse("Failed to request trip", 500)
  }
}
