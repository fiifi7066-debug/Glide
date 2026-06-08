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
      return errorResponse("Only drivers can complete trips", 403)
    }

    const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
    if (!driver) {
      return errorResponse("Driver profile not found", 404)
    }

    const { id } = params
    const trip = await prisma.trip.findUnique({ where: { id } })
    if (!trip) {
      return errorResponse("Trip not found", 404)
    }
    if (trip.status !== "STARTED") {
      return errorResponse("Trip must be started before completing")
    }
    if (trip.driverId !== driver.id) {
      return errorResponse("This trip is assigned to another driver", 403)
    }

    const [updated] = await prisma.$transaction([
      prisma.trip.update({
        where: { id },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: { totalTrips: { increment: 1 } },
      }),
    ])

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to complete trip", 500)
  }
}
