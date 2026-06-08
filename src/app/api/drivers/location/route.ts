import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }
    if (user.role !== "DRIVER") {
      return errorResponse("Only drivers can update location", 403)
    }

    const driver = await prisma.driver.findUnique({ where: { userId: user.id } })
    if (!driver) {
      return errorResponse("Driver profile not found", 404)
    }

    const { lat, lng } = await req.json()
    if (lat === undefined || lng === undefined) {
      return errorResponse("lat and lng required")
    }

    await prisma.driver.update({
      where: { id: driver.id },
      data: { currentLat: lat, currentLng: lng },
    })

    return successResponse({ message: "Location updated" })
  } catch (error) {
    return errorResponse("Failed to update location", 500)
  }
}
