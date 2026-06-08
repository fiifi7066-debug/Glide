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
    if (user.role !== "DRIVER") {
      return errorResponse("Only drivers can accept deliveries", 403)
    }

    const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
    if (!driver) {
      return errorResponse("Driver profile not found", 404)
    }

    const { id } = params
    const delivery = await prisma.delivery.findUnique({ where: { id } })
    if (!delivery) {
      return errorResponse("Delivery not found", 404)
    }
    if (delivery.status !== "REQUESTED") {
      return errorResponse("Delivery is not available for acceptance")
    }

    const updated = await prisma.delivery.update({
      where: { id },
      data: { driverId: driver.id, status: "ACCEPTED" },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to accept delivery", 500)
  }
}
