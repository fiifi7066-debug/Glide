import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    let deliveries

    if (user.role === "RIDER") {
      const rider = await prisma.rider.findUnique({ where: { userId: user.id } })
      if (!rider) {
        return errorResponse("Rider profile not found", 404)
      }
      deliveries = await prisma.delivery.findMany({
        where: { senderId: rider.id },
        orderBy: { createdAt: "desc" },
      })
    } else {
      const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
      if (!driver) {
        return errorResponse("Driver profile not found", 404)
      }
      deliveries = await prisma.delivery.findMany({
        where: { driverId: driver.id },
        orderBy: { createdAt: "desc" },
      })
    }

    return successResponse(deliveries)
  } catch (error) {
    return errorResponse("Failed to get delivery history", 500)
  }
}
