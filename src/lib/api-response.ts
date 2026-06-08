import { NextResponse } from "next/server"

export function successResponse(data: unknown, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(
  message: string,
  status: number = 400,
  details?: unknown
) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  )
}
