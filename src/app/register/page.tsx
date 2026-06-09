"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useStore } from "@/lib/store"

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useStore()
  const [role, setRole] = useState<"RIDER" | "DRIVER">("RIDER")
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", licenseNumber: "", vehicleModel: "", vehicleColor: "", licensePlate: "" })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.name || !form.email || !form.phone || !form.password) { setError("Please fill in all required fields"); return }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return }
    if (role === "DRIVER" && (!form.licenseNumber || !form.vehicleModel || !form.vehicleColor || !form.licensePlate)) { setError("Please fill in all driver details"); return }
    setLoading(true)
    try {
      const body = { name: form.name, email: form.email, phone: form.phone, password: form.password, role, ...(role === "DRIVER" && { licenseNumber: form.licenseNumber, vehicleModel: form.vehicleModel, vehicleColor: form.vehicleColor, licensePlate: form.licensePlate }) }
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Registration failed"); return }
      setUser(data.data.user)
      router.push(role === "DRIVER" ? "/driver" : "/rider")
    } catch { setError("Something went wrong. Please try again.") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E3A5F]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
              <span className="text-3xl font-bold text-white">G</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Join Glide today</p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-dark-border rounded-xl p-1">
              <button type="button" onClick={() => setRole("RIDER")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === "RIDER" ? "bg-dark-card text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-300"}`}>Rider</button>
              <button type="button" onClick={() => setRole("DRIVER")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === "DRIVER" ? "bg-dark-card text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-300"}`}>Driver</button>
            </div>

            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="input-dark" />
            <input type="email" placeholder="Email address" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-dark" />
            <input type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-dark" />
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => updateField("password", e.target.value)} className="input-dark pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} className="input-dark pr-12" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {role === "DRIVER" && (
              <>
                <div className="border-t border-dark-border pt-4"><p className="text-sm font-medium text-gray-300 mb-3">Driver Information</p></div>
                <input type="text" placeholder="License Number" value={form.licenseNumber} onChange={(e) => updateField("licenseNumber", e.target.value)} className="input-dark" />
                <input type="text" placeholder="Vehicle Model (e.g. Toyota Corolla)" value={form.vehicleModel} onChange={(e) => updateField("vehicleModel", e.target.value)} className="input-dark" />
                <input type="text" placeholder="Vehicle Color" value={form.vehicleColor} onChange={(e) => updateField("vehicleColor", e.target.value)} className="input-dark" />
                <input type="text" placeholder="License Plate" value={form.licensePlate} onChange={(e) => updateField("licensePlate", e.target.value)} className="input-dark" />
              </>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 gradient-btn">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account...
                </span>
              ) : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
