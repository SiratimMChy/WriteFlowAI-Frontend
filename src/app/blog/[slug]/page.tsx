import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Cast to any because Prisma types couldn't generate due to Windows dev server file lock
  const post = await (prisma as any).blogPost.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  })
  
  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <Navbar />
      
      {/* Background glow */}
      <div className="absolute top-0 inset-x-0 h-[60vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 pt-32 pb-32">
        {/* Post Hero */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <div className="font-semibold text-white">{post.author?.name || 'Admin'}</div>
                <div className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Featured Image placeholder */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full aspect-video object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          ) : (
            <div className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${post.imageGrad || 'from-pink-600 to-purple-600'} shadow-2xl border border-white/10`} />
          )}
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 text-xl prose prose-xl prose-invert prose-pink">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>

      <Footer />
    </div>
  )
}
