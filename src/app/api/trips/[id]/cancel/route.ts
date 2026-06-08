import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const { id } = params
    const trip = await prisma.trip.findUnique({ where: { id } })
    if (!trip) {
      return errorResponse("Trip not found", 404)
    }
    if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
      return errorResponse("Trip cannot be cancelled")
    }

    const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
    const rider = await prisma.rider.findUnique({ where: { userId: user.id } })

    const isDriver = driver && trip.driverId === driver.id
    const isRider = rider && trip.riderId === rider.id

    if (!isDriver && !isRider) {
      return errorResponse("Not authorized to cancel this trip", 403)
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to cancel trip", 500)
  }
}
