"use client"

import { useState } from "react"
import { FiX, FiCheck } from "react-icons/fi"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onProcess: (method: string) => void
}

const METHODS = [
  { id: "credit_card", label: "Credit Card", icon: "💳" },
  { id: "mobile_money", label: "Mobile Money", icon: "📱" },
  { id: "cash", label: "Cash", icon: "💵" },
]

export default function PaymentModal({ isOpen, onClose, amount, onProcess }: PaymentModalProps) {
  const [method, setMethod] = useState("credit_card")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handlePay = async () => {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setProcessing(false)
    setSuccess(true)
    setTimeout(() => {
      onProcess(method)
      setSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX size={20} className="text-gray-400" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <FiCheck size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
            <p className="text-gray-500 mt-1">GHS {amount.toFixed(2)} paid via {METHODS.find((m) => m.id === method)?.label}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
              <div className="mt-3">
                <span className="text-4xl font-bold text-primary">GHS {amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                    method === m.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{m.label}</span>
                  {method === m.id && (
                    <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <FiCheck size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay GHS ${amount.toFixed(2)}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
