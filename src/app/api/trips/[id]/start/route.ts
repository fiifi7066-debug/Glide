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
      return errorResponse("Only drivers can start trips", 403)
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
    if (trip.status !== "ACCEPTED") {
      return errorResponse("Trip must be accepted before starting")
    }
    if (trip.driverId !== driver.id) {
      return errorResponse("This trip is assigned to another driver", 403)
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: { status: "STARTED", startedAt: new Date() },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse("Failed to start trip", 500)
  }
}
