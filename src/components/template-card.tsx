import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Users, ArrowRight } from "lucide-react"

export type Template = {
  id: string
  title: string
  description: string
  category: string
  rating: number
  usageCount: number
  thumbnail?: string | null
}

export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden h-full">
      {/* Thumbnail */}
      <div className="h-40 bg-white/5 relative border-b border-white/5">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <span className="text-4xl">📄</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 text-xs font-medium">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {template.rating.toFixed(1)}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span className="text-xs font-medium px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-md">
            {template.category}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 text-white line-clamp-1">{template.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {template.description}
        </p>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            {template.usageCount.toLocaleString()} uses
          </div>
          <Link href={`/dashboard/draft?templateId=${template.id}`}>
            <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg transition-all group border-0">
              Use Template
              <ArrowRight className="ml-1.5 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function TemplateCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.01] h-full overflow-hidden animate-pulse">
      <div className="h-40 bg-white/5" />
      <div className="p-5 flex flex-col flex-1">
        <div className="h-5 w-20 bg-white/10 rounded-md mb-4" />
        <div className="h-6 w-3/4 bg-white/10 rounded-md mb-3" />
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-white/5 rounded-md" />
          <div className="h-4 w-5/6 bg-white/5 rounded-md" />
        </div>
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="h-4 w-20 bg-white/5 rounded-md" />
          <div className="h-8 w-20 bg-white/5 rounded-md" />
        </div>
      </div>
    </div>
  )
}
