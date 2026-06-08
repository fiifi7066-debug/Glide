"use client"

import { useState } from "react"
import { FiStar, FiX } from "react-icons/fi"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (score: number, comment: string) => void
  targetName: string
  targetRole: "driver" | "rider"
}

export default function RatingModal({ isOpen, onClose, onSubmit, targetName, targetRole }: RatingModalProps) {
  const [score, setScore] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (score === 0) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    onSubmit(score, comment)
    setScore(0)
    setComment("")
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[scaleIn_0.2s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX size={20} className="text-gray-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <FiStar size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Rate your {targetRole}</h3>
          <p className="text-gray-500 text-sm mt-1">How was your experience with {targetName}?</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setScore(star)}
              className="transition-transform hover:scale-110"
            >
              <FiStar
                size={36}
                className={`${
                  star <= (hover || score)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={score === 0 || submitting}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  )
}
