import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    const { id } = params
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) {
      return errorResponse("Payment not found", 404)
    }

    return successResponse(payment)
  } catch (error) {
    return errorResponse("Failed to get payment", 500)
  }
}
