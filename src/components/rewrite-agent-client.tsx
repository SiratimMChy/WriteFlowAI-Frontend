"use client"

import { useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import { Sparkles, Save, Copy, FileText, ArrowRight, Loader2, Scissors, Expand, Briefcase, Smile, CheckCircle, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getCookie } from "cookies-next"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const rewriteActions = [
  { id: "grammar", label: "Fix Grammar", icon: CheckCircle },
  { id: "shorten", label: "Shorten", icon: Scissors },
  { id: "lengthen", label: "Lengthen", icon: Expand },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "casual", label: "Casual", icon: Smile },
]

export function RewriteAgentClient() {
  const router = useRouter()
  const [action, setAction] = useState("grammar")
  const [format, setFormat] = useState("auto")
  const [title, setTitle] = useState("Rewritten Document")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: `/api/ai/rewrite`,
    body: {
      action,
      format
    },
    streamProtocol: 'text',
    onError: (err) => {
      if (err.message.includes("Upgrade required") || err.message.includes("403")) {
        setShowUpgradeModal(true)
      } else {
        toast.error(err.message || "Failed to generate content.")
      }
    }
  })

  const handleCopy = () => {
    if (!completion) return
    navigator.clipboard.writeText(completion)
    toast.success("Copied to clipboard")
  }

  const handleSave = async () => {
    if (!completion) return

    const res = await fetch(`/api/documents/save`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: completion,
        status: "draft",
        type: "rewrite",
        wordCount: completion.split(/\s+/).length,
      })
    })

    if (res.ok) {
      toast.success("Document saved successfully")
      router.push("/dashboard/documents")
    } else {
      toast.error("Failed to save document")
    }
  }

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-8">
      {/* Left Panel - Config */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col h-full overflow-hidden">
        <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            Rewrite Agent
          </h1>
          <p className="text-gray-400 text-sm mt-1">Improve, reformat, and perfect your existing text.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
          <div className="space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="space-y-2">
              <Label className="text-gray-300">Original Text</Label>
              <Textarea 
                value={input}
                onChange={handleInputChange}
                required
                className="w-full h-48 p-3 rounded-xl bg-black border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Paste the text you want to rewrite here..."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300">What would you like to do?</Label>
              <div className="grid grid-cols-2 gap-3">
                {rewriteActions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAction(a.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all text-left",
                      action === a.id 
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" 
                        : "bg-black border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                    )}
                  >
                    <a.icon className="w-4 h-4" />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Output Format</Label>
              <select 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none outline-none"
              >
                <option value="auto">Auto (Keep original format)</option>
                <option value="paragraphs">Well-structured paragraphs</option>
                <option value="bullets">Bulleted list</option>
              </select>
            </div>

            <Button disabled={isLoading || !input} type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Rewrite Text
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Right Panel - Output */}
      <div className="flex-1 flex flex-col h-full rounded-2xl bg-white/[0.01] border border-white/5 overflow-hidden">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-white font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!completion} className="text-gray-400 hover:text-white">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={!completion || isLoading} className="text-gray-400 hover:text-white">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto bg-black/20">
          {completion ? (
            <div className="prose prose-invert prose-emerald max-w-none whitespace-pre-wrap font-sans leading-relaxed">
              {completion}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-gray-500 text-center flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-500/50" />
              </div>
              <p>Your rewritten content will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                  <Lock className="w-8 h-8 text-violet-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Limit Reached!</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  You've reached your free tier limit for AI generations this month. Upgrade to our Pro plan for unlimited access and advanced AI models.
                </p>
                
                <Link href="/dashboard/profile" className="w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                    Upgrade to Pro
                  </Button>
                </Link>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
