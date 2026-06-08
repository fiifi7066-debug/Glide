import { successResponse } from "@/lib/api-response"

export async function POST() {
  const res = successResponse({ message: "Logged out" })
  res.cookies.set("glide_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return res
}
