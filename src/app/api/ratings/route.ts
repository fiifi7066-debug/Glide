import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const { tripId, rateeId, score, comment } = await req.json()
    if (!tripId || !rateeId || !score) {
      return errorResponse("tripId, rateeId, and score are required")
    }
    if (score < 1 || score > 5) {
      return errorResponse("Score must be between 1 and 5")
    }

    const rating = await prisma.rating.create({
      data: {
        tripId,
        raterId: user.id,
        rateeId,
        score,
        comment: comment || null,
      },
    })

    const ratings = await prisma.rating.findMany({
      where: { rateeId },
      select: { score: true },
    })
    const avgScore = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length

    const rateeUser = await prisma.user.findUnique({ where: { id: rateeId } })
    if (rateeUser?.role === "DRIVER") {
      const driver = await prisma.driver.findUnique({ where: { userId: rateeId } })
      if (driver) {
        await prisma.driver.update({
          where: { id: driver.id },
          data: { rating: Math.round(avgScore * 10) / 10 },
        })
      }
    }

    return successResponse(rating, 201)
  } catch (error) {
    return errorResponse("Failed to create rating", 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return errorResponse("userId query param required")
    }

    const ratings = await prisma.rating.findMany({
      where: { rateeId: userId },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(ratings)
  } catch (error) {
    return errorResponse("Failed to get ratings", 500)
  }
}
