import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, phone: true, avatar: true },
        },
      },
    })

    if (!driver) {
      return errorResponse("Driver not found", 404)
    }

    return successResponse({
      licenseNumber: driver.licenseNumber,
      vehicleModel: driver.vehicleModel,
      vehicleColor: driver.vehicleColor,
      licensePlate: driver.licensePlate,
      isAvailable: driver.isAvailable,
      currentLat: driver.currentLat,
      currentLng: driver.currentLng,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      user: driver.user,
    })
  } catch (error) {
    return errorResponse("Failed to get driver", 500)
  }
}
