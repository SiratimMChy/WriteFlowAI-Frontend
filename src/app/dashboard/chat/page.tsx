import { MessageSquare, Send, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatAssistantPage() {
  const messages = [
    { role: "assistant", content: "Hello! I'm your AI writing assistant. How can I help you today?" },
    { role: "user", content: "Can you help me brainstorm some titles for a blog post about artificial intelligence in marketing?" },
    { role: "assistant", content: "Absolutely! Here are 5 catchy titles for your blog post:\n\n1. The AI Advantage: Revolutionizing Your Marketing Strategy\n2. Beyond the Hype: How AI is Reshaping Digital Marketing\n3. Marketer's Guide to AI: Tools, Trends, and Tactics\n4. Automate to Elevate: AI's Impact on Marketing ROI\n5. The Future is Now: AI-Powered Marketing for 2024" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh)] lg:h-[calc(100vh)]">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center px-8 bg-white/[0.01]">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Chat Assistant
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-violet-600" : "bg-white/10"}`}>
              {msg.role === "assistant" ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === "assistant" ? "bg-white/[0.02] border border-white/5" : "bg-blue-600/20 border border-blue-500/20 text-blue-50"}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#050505] border-t border-white/5 flex-shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <Input 
            placeholder="Ask anything or paste some text..." 
            className="w-full h-14 pl-4 pr-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus-visible:ring-violet-500"
          />
          <Button size="icon" className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  )
}
