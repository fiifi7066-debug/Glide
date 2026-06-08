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
    const delivery = await prisma.delivery.findUnique({ where: { id } })
    if (!delivery) {
      return errorResponse("Delivery not found", 404)
    }
    if (delivery.status === "DELIVERED" || delivery.status === "CANCELLED") {
      return errorResponse("Delivery cannot be cancelled")
    }

    const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
    const rider = await prisma.rider.findUnique({ where: { userId: user.id } })

    const isDriver = driver && delivery.driverId === driver.id
    const isSender = rider && delivery.senderId === rider.id

    if (!isDriver && !isSender) {
      return errorResponse("Not authorized to cancel this delivery", 403)
    }

    const updated = await prisma.delivery.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to cancel delivery", 500)
  }
}
