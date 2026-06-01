import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TemplateCard } from "@/components/template-card"
import { Button } from "@/components/ui/button"
import { Star, Users, ArrowRight, CheckCircle2, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WriteReviewForm } from "@/components/write-review-form"
import { api } from "@/lib/api"

export default async function TemplateDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  let template: any = null
  let reviews: any[] = []
  let relatedTemplates: any[] = []

  try {
    const templateRes = await api.get(`/items/${params.id}`)
    if (templateRes.data.success && templateRes.data.data) {
      template = templateRes.data.data
    }
  } catch (err) {
    console.error("Failed to fetch template detail", err)
  }

  if (!template) {
    notFound()
  }

  try {
    const reviewsRes = await api.get(`/reviews/item/${params.id}`).catch(() =>
      api.get(`/reviews/item-reviews/${params.id}`).catch(() => ({ data: { success: false, data: [] } }))
    )
    if (reviewsRes.data.success) {
      reviews = (reviewsRes.data.data || []).filter((r: any) => r.status === "approved" || r.status === "Approved")
    }
  } catch (err) {
    console.error("Failed to fetch reviews", err)
  }

  try {
    const relatedRes = await api.get("/items", {
      params: { category: template.category, limit: 5 }
    })
    if (relatedRes.data.success) {
      relatedTemplates = (relatedRes.data.data || []).filter((t: any) => t.id !== template.id).slice(0, 4)
    }
  } catch (err) {
    console.error("Failed to fetch related templates", err)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full mx-auto pt-24 sm:pt-32 pb-16">
        
        {/* Header Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium px-3 py-1 bg-violet-500/20 text-violet-300 rounded-md">
              {template.category}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-yellow-400 font-medium">
              <Star className="w-4 h-4 fill-yellow-400" />
              {(template.rating || 0).toFixed(1)} ({(template.ratingCount || 0)} reviews)
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              {(template.usageCount || 0).toLocaleString()} uses
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {template.title}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed mb-8">
            {template.description}
          </p>

          <div className="flex items-center gap-4">
            <Link href={`/dashboard/draft?templateId=${template.id}`}>
              <Button size="lg" className="h-14 px-8 bg-violet-600 hover:bg-violet-700 text-white text-base rounded-full shadow-lg">
                Use Template
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Overview</h2>
              <div className="prose prose-invert prose-violet max-w-none text-gray-300">
                <p>This template is specifically designed to help you generate high-quality {template.category.toLowerCase()} content effortlessly. It utilizes the {template.aiModel} model to ensure the output is engaging, relevant, and optimized for your target audience.</p>
                <h3>Who is this best suited for?</h3>
                <ul>
                  <li>Content Creators and Marketers</li>
                  <li>Founders and Entrepreneurs</li>
                  <li>Agencies managing multiple brands</li>
                </ul>
              </div>
            </section>

            {/* Sample Output */}
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Sample Output</h2>
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">AI Generated Response</span>
                </div>
                <div className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed bg-black/50 p-6 rounded-xl border border-white/5">
                  {template.sampleOutput}
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <WriteReviewForm templateId={template.id} />
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-white/10">
                            <AvatarImage src={review.user?.image || ""} />
                            <AvatarFallback className="bg-violet-900 text-xs">{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.user?.name || "Anonymous"}</div>
                            <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 text-sm">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400" : "text-gray-600"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-xl">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-400">No reviews yet</h3>
                  <p className="text-sm text-gray-500 mt-1">Be the first to review this template.</p>
                </div>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Key Information */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Key Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Category</span>
                  <span className="font-medium text-sm">{template.category}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Target Word Count</span>
                  <span className="font-medium text-sm">{template.wordCount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Default Tone</span>
                  <span className="font-medium text-sm">{template.tone}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 text-sm">AI Model</span>
                  <span className="font-medium text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {template.aiModel}
                  </span>
                </div>
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="bg-gradient-to-b from-violet-900/20 to-black border border-violet-500/20 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-violet-300">Prompt Structure</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                This template uses a highly optimized prompt structure to get the best results from the AI.
              </p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 text-xs font-mono text-gray-500 blur-sm select-none relative overflow-hidden group cursor-not-allowed">
                Write a detailed and engaging post about [Topic]. Keep the tone [Tone] and ensure it targets the keyword [Keyword]...
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <span className="text-white font-sans text-sm font-medium">Internal System Prompt</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Templates */}
        {relatedTemplates.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-24 border-t border-white/10 pt-16">
            <h2 className="text-2xl font-bold mb-8">Related Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTemplates.map((t: any) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
