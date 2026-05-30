import { Search, Filter, FileText, MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DocumentsPage() {
  const documents = [
    { title: "Q3 Marketing Strategy", date: "2 hours ago", words: 1200, type: "Blog Post" },
    { title: "Email Campaign - Product Launch", date: "Yesterday", words: 450, type: "Email" },
    { title: "Blog Post: 10 SEO Tips", date: "3 days ago", words: 2100, type: "Blog Post" },
    { title: "Landing Page Copy v2", date: "Last week", words: 850, type: "Web Copy" },
    { title: "Weekly Newsletter", date: "Last week", words: 600, type: "Email" },
    { title: "LinkedIn Ad Variants", date: "2 weeks ago", words: 150, type: "Social Media" },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-gray-400 mt-1">Manage and organize all your generated content.</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl focus-visible:ring-violet-500"
          />
        </div>
        <Button variant="outline" className="h-12 border-white/10 bg-white/[0.02] text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-xl w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group flex flex-col justify-between min-h-[160px]">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-200 group-hover:text-violet-300 transition-colors line-clamp-1">{doc.title}</h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>{doc.type}</span>
                <span>•</span>
                <span>{doc.date}</span>
                <span>•</span>
                <span>{doc.words} words</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
