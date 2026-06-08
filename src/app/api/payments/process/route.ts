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

    const { tripId, deliveryId, method } = await req.json()
    if ((!tripId && !deliveryId) || !method) {
      return errorResponse("tripId or deliveryId, and method are required")
    }

    let amount: number | null = null

    if (tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId } })
      if (!trip) {
        return errorResponse("Trip not found", 404)
      }
      amount = trip.fare
    } else if (deliveryId) {
      const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } })
      if (!delivery) {
        return errorResponse("Delivery not found", 404)
      }
      amount = delivery.fare
    }

    if (amount === null) {
      return errorResponse("Could not calculate amount")
    }

    const payment = await prisma.payment.create({
      data: {
        tripId: tripId || null,
        deliveryId: deliveryId || null,
        amount,
        method,
        status: "COMPLETED",
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      },
    })

    return successResponse(payment, 201)
  } catch (error) {
    return errorResponse("Failed to process payment", 500)
  }
}
