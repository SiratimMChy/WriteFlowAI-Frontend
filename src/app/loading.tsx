import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="font-heading text-lg font-medium text-gray-300 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
