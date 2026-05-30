import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Sparkles, FileText, Zap, Clock, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const firstName = session?.user?.name?.split(" ")[0] || "Creator"

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-gray-400 mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Documents Created" 
          value="12" 
          trend="+2 this week"
          icon={<FileText className="w-5 h-5 text-violet-400" />} 
        />
        <StatCard 
          title="Words Generated" 
          value="24,592" 
          trend="+5,000 this week"
          icon={<Zap className="w-5 h-5 text-blue-400" />} 
        />
        <StatCard 
          title="Time Saved" 
          value="14h" 
          trend="Based on avg. writing speed"
          icon={<Clock className="w-5 h-5 text-emerald-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Documents</h2>
            <Link href="/dashboard/documents" className="text-sm text-violet-400 hover:text-violet-300">
              View all
            </Link>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {[
              { title: "Q3 Marketing Strategy", date: "2 hours ago", words: 1200 },
              { title: "Email Campaign - Product Launch", date: "Yesterday", words: 450 },
              { title: "Blog Post: 10 SEO Tips", date: "3 days ago", words: 2100 },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200 group-hover:text-violet-300 transition-colors">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{doc.date} • {doc.words} words</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <QuickActionCard 
              title="Blog Post Writer"
              description="Generate a full SEO-optimized article."
              icon={<Sparkles className="w-5 h-5 text-violet-400" />}
              color="violet"
            />
            <QuickActionCard 
              title="Social Media Ad"
              description="Create engaging copy for FB/LinkedIn."
              icon={<Zap className="w-5 h-5 text-blue-400" />}
              color="blue"
            />
            <QuickActionCard 
              title="Content Rewriter"
              description="Improve or rephrase existing text."
              icon={<FileText className="w-5 h-5 text-emerald-400" />}
              color="emerald"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color }: { title: string, description: string, icon: React.ReactNode, color: string }) {
  const bgColors = {
    violet: "hover:bg-violet-500/10 hover:border-violet-500/30",
    blue: "hover:bg-blue-500/10 hover:border-blue-500/30",
    emerald: "hover:bg-emerald-500/10 hover:border-emerald-500/30",
  }
  
  return (
    <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer transition-all ${bgColors[color as keyof typeof bgColors]} group`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}
