import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        driver: true,
        rider: true,
      },
    })

    if (!profile) {
      return errorResponse("User not found", 404)
    }

    return successResponse(profile)
  } catch (error) {
    return errorResponse("Failed to get profile", 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const { name, phone, avatar } = await req.json()

    const updateData: Record<string, string> = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar

    if (Object.keys(updateData).length === 0) {
      return errorResponse("No fields to update")
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return successResponse({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      avatar: updated.avatar,
    })
  } catch (error) {
    return errorResponse("Failed to update profile", 500)
  }
}
