import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    let delivery

    if (user.role === "RIDER") {
      const rider = await prisma.rider.findUnique({ where: { userId: user.id } })
      if (!rider) {
        return errorResponse("Rider profile not found", 404)
      }
      delivery = await prisma.delivery.findFirst({
        where: {
          senderId: rider.id,
          status: { in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        },
      })
    } else {
      const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
      if (!driver) {
        return errorResponse("Driver profile not found", 404)
      }
      delivery = await prisma.delivery.findFirst({
        where: {
          driverId: driver.id,
          status: { in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        },
      })
    }

    return successResponse(delivery || null)
  } catch (error) {
    return errorResponse("Failed to get active delivery", 500)
  }
}
