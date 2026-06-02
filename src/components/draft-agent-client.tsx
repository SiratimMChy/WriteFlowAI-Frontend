"use client"

import { useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import { Sparkles, Save, Copy, FileText, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { getCookie } from "cookies-next"

export function DraftAgentClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("templateId")

  const [tone, setTone] = useState("Professional")
  const [keywords, setKeywords] = useState("")
  const [title, setTitle] = useState("Untitled Document")

  const [token] = useState<string | undefined>(() => {
    let t = getCookie("token") as string | undefined
    if (!t && typeof window !== "undefined") {
      t = localStorage.getItem("token") || undefined
    }
    return t
  })

  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_API_URL}/ai/draft`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: {
      tone,
      keywords,
      templateId
    },
    streamProtocol: 'text',
    onError: (err) => {
      toast.error(err.message || "Failed to generate content. Please check OPENAI_API_KEY")
    }
  })

  const handleCopy = () => {
    if (!completion) return
    navigator.clipboard.writeText(completion)
    toast.success("Copied to clipboard")
  }

  const handleSave = async () => {
    if (!completion) return
    
    let token = getCookie("token") as string | undefined
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || undefined
    }

    // Server action to save document
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/save`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        title,
        content: completion,
        status: "draft",
        type: "draft",
        wordCount: completion.split(/\s+/).length,
        templateId
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
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col h-full overflow-hidden">
        <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Draft Agent
          </h1>
          <p className="text-gray-400 text-sm mt-1">Configure your AI writing assistant.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
          <div className="space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="space-y-2">
              <Label className="text-gray-300">Topic or Prompt</Label>
              <Textarea 
                value={input}
                onChange={handleInputChange}
                required
                className="w-full h-32 p-3 rounded-xl bg-black border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                placeholder="What do you want to write about?"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Tone of Voice</Label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none outline-none"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Enthusiastic</option>
                <option>Informative</option>
                <option>Persuasive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Keywords (Optional)</Label>
              <Input 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. AI, writing, productivity" 
                className="bg-black border-white/10 h-12 rounded-xl focus-visible:ring-violet-500"
              />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Generate Content
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
            <div className="prose prose-invert prose-violet max-w-none whitespace-pre-wrap font-sans leading-relaxed">
              {completion}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-gray-500 text-center flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-violet-500/50" />
              </div>
              <p>Your generated content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
