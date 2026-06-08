import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role, licenseNumber, vehicleModel, vehicleColor, licensePlate } = await req.json()

    if (!name || !email || !password || !phone) {
      return errorResponse("Missing required fields")
    }
    if (!role || !["RIDER", "DRIVER"].includes(role)) {
      return errorResponse("Invalid role")
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse("Email already in use")
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        ...(role === "DRIVER"
          ? {
              driver: {
                create: {
                  licenseNumber: licenseNumber || "",
                  vehicleModel: vehicleModel || "",
                  vehicleColor: vehicleColor || "",
                  licensePlate: licensePlate || "",
                },
              },
            }
          : {
              rider: {
                create: {},
              },
            }),
      },
      include: {
        driver: true,
        rider: true,
      },
    })

    const tokenUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role as "RIDER" | "DRIVER" }
    const token = generateToken(tokenUser)

    const res = successResponse({ user: tokenUser, token }, 201)
    res.cookies.set("glide_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    return errorResponse("Registration failed", 500)
  }
}
