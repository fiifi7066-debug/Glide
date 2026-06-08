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
      return errorResponse("Only drivers can complete deliveries", 403)
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
    if (delivery.driverId !== driver.id) {
      return errorResponse("This delivery is assigned to another driver", 403)
    }
    if (delivery.status !== "PICKED_UP") {
      return errorResponse("Delivery must be picked up before delivering")
    }

    const [updated] = await prisma.$transaction([
      prisma.delivery.update({
        where: { id },
        data: { status: "DELIVERED", completedAt: new Date() },
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: { totalTrips: { increment: 1 } },
      }),
    ])

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to complete delivery", 500)
  }
}
