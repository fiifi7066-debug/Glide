import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Glide - Ride Hailing & Delivery",
  description: "Fast, reliable rides and deliveries at your fingertips",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
