import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  // Cast to any because Prisma types couldn't generate due to Windows dev server file lock
  const allPosts = await (prisma as any).blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'asc' },
    include: { author: true }
  })

  if (allPosts.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
        <Navbar />
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
           <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">No Posts Found</h1>
        </main>
        <Footer />
      </div>
    )
  }

  const featuredPost = allPosts[0]
  const posts = allPosts.slice(1)

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <Navbar />
      
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[80vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            The WriteFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Insights, guides, and strategies to help you master AI writing and scale your content engine.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center p-6 md:p-10">
              <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {featuredPost.imageUrl ? (
                   <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                   <div className={`w-full h-full bg-gradient-to-br ${featuredPost.imageGrad || 'from-pink-600 to-purple-600'} opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500`} />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {featuredPost.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{featuredPost.author?.name || 'Admin'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        )}
        
        {/* Latest Posts Grid */}
        <div>
          <h2 className="font-heading text-3xl font-bold mb-10 flex items-center gap-3">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any, i: number) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group h-full">
                <div className="h-full flex flex-col p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-6">
                    {post.imageUrl ? (
                       <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                       <div className={`w-full h-full bg-gradient-to-br ${post.imageGrad || 'from-pink-600 to-purple-600'} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-pink-400">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <h4 className="font-heading text-xl font-bold mb-3 group-hover:text-white text-gray-200 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-gray-400 font-medium">{post.author?.name || 'Admin'}</div>
                      <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
