import { History, Search, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AIHistoryPage() {
  const historyLog = [
    { id: "1", date: "Today, 10:45 AM", action: "Draft Agent", snippet: "Write a blog post about AI...", tokens: 450 },
    { id: "2", date: "Today, 09:12 AM", action: "Rewrite Agent", snippet: "Make this paragraph sound more professional...", tokens: 120 },
    { id: "3", date: "Yesterday, 04:30 PM", action: "Chat Assistant", snippet: "Brainstorm titles for marketing...", tokens: 890 },
    { id: "4", date: "May 28, 02:15 PM", action: "Draft Agent", snippet: "Generate an email campaign for...", tokens: 1200 },
    { id: "5", date: "May 27, 11:20 AM", action: "Rewrite Agent", snippet: "Shorten the following text: The quick brown...", tokens: 80 },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-8 h-8 text-violet-500" />
            AI History
          </h1>
          <p className="text-gray-400 mt-1">Review your past AI interactions and token usage.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <Input 
          placeholder="Search history..." 
          className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl focus-visible:ring-violet-500"
        />
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 font-medium text-gray-400">Date & Time</th>
                <th className="p-4 font-medium text-gray-400">Action Type</th>
                <th className="p-4 font-medium text-gray-400">Prompt Snippet</th>
                <th className="p-4 font-medium text-gray-400">Usage</th>
                <th className="p-4 font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {historyLog.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0 group">
                  <td className="p-4 text-sm text-gray-300">{log.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 truncate max-w-xs">{log.snippet}</td>
                  <td className="p-4 text-sm text-gray-300">{log.tokens} tokens</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
