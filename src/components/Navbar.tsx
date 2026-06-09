"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiMenu, FiX, FiUser, FiLogOut, FiClock, FiHome } from "react-icons/fi"
import { useStore } from "@/lib/store"

export default function Navbar() {
  const { user, setUser } = useStore()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">Glide</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={user.role === "DRIVER" ? "/driver" : "/rider"}
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <FiHome size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <FiClock size={16} />
                  History
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <FiUser size={16} />
                  Profile
                </Link>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  {user.name}
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">{user.role}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border px-4 py-4 space-y-3">
          {!user ? (
            <>
              <Link href="/login" className="block px-4 py-2 text-gray-300 hover:bg-dark-border rounded-xl" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="block px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl text-center" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-dark-border/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>
              <Link href={user.role === "DRIVER" ? "/driver" : "/rider"} className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-border rounded-xl" onClick={() => setMobileOpen(false)}><FiHome size={18} /> Dashboard</Link>
              <Link href="/history" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-border rounded-xl" onClick={() => setMobileOpen(false)}><FiClock size={18} /> History</Link>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-dark-border rounded-xl" onClick={() => setMobileOpen(false)}><FiUser size={18} /> Profile</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl w-full"><FiLogOut size={18} /> Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
