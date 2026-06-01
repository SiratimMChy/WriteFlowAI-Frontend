"use client"

import { useState, useTransition } from "react"
import { useAuth } from "@/components/auth-provider"
import { Star, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

export function WriteReviewForm({ templateId }: { templateId: string }) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleOpen = () => {
    if (!user) {
      window.location.href = "/login?callbackUrl=" + encodeURIComponent(window.location.pathname)
      return
    }
    setIsOpen(!isOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!content.trim() || content.trim().length < 5) {
      setError("Review content must be at least 5 characters long.")
      return
    }

    startTransition(async () => {
      try {
        const res = await api.post("/reviews", {
          templateId,
          itemId: templateId,
          rating,
          content: content.trim()
        })

        if (res.data.success) {
          setSuccess(res.data.message || "Your review has been submitted and is pending admin approval.")
          setContent("")
          setRating(5)
          setTimeout(() => setIsOpen(false), 3000)
        } else {
          setError(res.data.message || "Failed to submit review.")
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to submit review.")
      }
    })
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <Button 
          variant={isOpen ? "ghost" : "outline"} 
          className="h-10 border-white/10 text-gray-300 hover:text-white"
          onClick={handleOpen}
        >
          {isOpen ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block font-medium">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-yellow-400 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating ?? rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-semibold text-gray-400 ml-2">
                    {rating} Star{rating > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 block font-medium">Review Content</label>
                <Textarea
                  placeholder="Share your experience using this template..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 min-h-[100px] rounded-xl focus-visible:ring-violet-500"
                  disabled={isPending}
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-red-400 bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm font-medium text-emerald-400 bg-emerald-500/10 py-3 px-4 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="bg-violet-600 hover:bg-violet-700 text-white h-11 px-6 rounded-xl font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
