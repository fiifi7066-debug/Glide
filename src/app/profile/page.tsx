"use client"

import { useState, useEffect, useCallback } from "react"
import { useStore } from "@/lib/store"
import { FiEdit2, FiSave, FiCamera, FiStar, FiAward } from "react-icons/fi"
import type { DriverData } from "@/types"

export default function ProfilePage() {
  const { user, driverData, setDriverData, setUser } = useStore()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleModel: "",
    vehicleColor: "",
    licensePlate: "",
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }))
    }
  }, [user])

  const fetchDriverData = useCallback(async () => {
    try {
      const res = await fetch("/api/users/profile")
      if (res.ok) {
        const json = await res.json()
        const profile = json.data
        if (profile.driver) {
          setDriverData(profile.driver)
          setForm((prev) => ({
            ...prev,
            licenseNumber: profile.driver.licenseNumber || "",
            vehicleModel: profile.driver.vehicleModel || "",
            vehicleColor: profile.driver.vehicleColor || "",
            licensePlate: profile.driver.licensePlate || "",
          }))
        }
      }
    } catch {
      // ignore
    }
  }, [setDriverData])

  useEffect(() => {
    if (user?.role === "DRIVER") {
      fetchDriverData()
    }
  }, [user, fetchDriverData])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const json = await res.json()
        const profile = json.data
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          avatar: profile.avatar,
        })
        if (profile.driver) setDriverData(profile.driver)
        setMessage("Profile updated successfully!")
        setEditing(false)
      } else {
        setMessage("Failed to update profile")
      }
    } catch {
      setMessage("Something went wrong")
    }
    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiCamera size={14} className="text-gray-500" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {user.role}
            </span>

            {user.role === "DRIVER" && driverData && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-1 text-yellow-500">
                  <FiStar size={18} fill="currentColor" />
                  <span className="text-lg font-bold text-gray-800">
                    {driverData.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <FiAward size={16} />
                  <span className="text-sm">
                    {driverData.totalTrips} trips completed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Personal Information
              </h3>
              <button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                disabled={saving}
              >
                {editing ? (
                  <>{saving ? "Saving..." : <><FiSave size={16} /> Save</>}</>
                ) : (
                  <><FiEdit2 size={16} /> Edit</>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={!editing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                    editing
                      ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      : "bg-gray-50 text-gray-700 border border-transparent"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={!editing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                    editing
                      ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      : "bg-gray-50 text-gray-700 border border-transparent"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={!editing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                    editing
                      ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      : "bg-gray-50 text-gray-700 border border-transparent"
                  }`}
                />
              </div>
            </div>
          </div>

          {user.role === "DRIVER" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Vehicle &amp; License
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={form.licenseNumber}
                    onChange={(e) =>
                      updateField("licenseNumber", e.target.value)
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                      editing
                        ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        : "bg-gray-50 text-gray-700 border border-transparent"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={form.vehicleModel}
                    onChange={(e) =>
                      updateField("vehicleModel", e.target.value)
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                      editing
                        ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        : "bg-gray-50 text-gray-700 border border-transparent"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    value={form.vehicleColor}
                    onChange={(e) =>
                      updateField("vehicleColor", e.target.value)
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                      editing
                        ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        : "bg-gray-50 text-gray-700 border border-transparent"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    value={form.licensePlate}
                    onChange={(e) =>
                      updateField("licensePlate", e.target.value)
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                      editing
                        ? "bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        : "bg-gray-50 text-gray-700 border border-transparent"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {user.role === "RIDER" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Payment Method
              </h3>
              <p className="text-sm text-gray-500">
                No payment method saved yet.
              </p>
              <button className="mt-3 px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                Add Payment Method
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Change Password
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-200 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
