import { getAuthUser } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return errorResponse("Not authenticated", 401)
    }
    return successResponse(user)
  } catch (error) {
    return errorResponse("Failed to get user", 500)
  }
}
