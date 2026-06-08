import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return errorResponse("Email and password required")
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return errorResponse("Invalid credentials", 401)
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return errorResponse("Invalid credentials", 401)
    }

    const tokenUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role as "RIDER" | "DRIVER" }
    const token = generateToken(tokenUser)

    const res = successResponse({ user: tokenUser, token })
    res.cookies.set("glide_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    return errorResponse("Login failed", 500)
  }
}
