import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">The WriteFlow Blog</h1>
        <p className="text-xl text-gray-400 mb-12">Insights, guides, and updates on AI writing.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[1,2,3,4].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer">
              <div className="h-48 bg-white/5 rounded-xl mb-4"></div>
              <div className="text-xs text-violet-400 font-medium mb-2">Guides</div>
              <h3 className="text-xl font-bold mb-2">How to 10x your content output with AI</h3>
              <p className="text-gray-400 text-sm">Learn the exact frameworks used by top creators to scale their content production without losing quality.</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
