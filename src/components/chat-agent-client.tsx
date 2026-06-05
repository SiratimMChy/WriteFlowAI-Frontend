"use client"

import { MessageSquare, Send, User, Bot, Loader2, Wand2, Sparkles, PenLine, Lightbulb, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function ChatAgentClient() {
  const [input, setInput] = useState("")
  const { user } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const [messages, setMessages] = useState<any[]>([])
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const stopRef = useRef(false)

  const stop = () => { stopRef.current = true }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e?: React.FormEvent, explicitMessage?: string) => {
    if (e) e.preventDefault()
    
    const messageToSend = explicitMessage || input
    if (!messageToSend.trim()) return
    
    if (!user) {
      toast.error("Please log in to use the chat assistant.")
      return
    }
    
    setInput("")
    const userMessage = { id: Date.now().toString(), role: 'user', content: messageToSend }
    setMessages(prev => [...prev, userMessage])
    setIsLoadingChat(true)
    stopRef.current = false

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      const assistantMessageId = Date.now().toString() + "-ai"
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }])

      if (reader) {
        while (!stopRef.current) {
          const { done, value } = await reader.read()
          if (done) break
          
          const text = decoder.decode(value, { stream: true })
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId ? { ...m, content: m.content + text } : m
          ))
        }
        if (stopRef.current) reader.cancel()
      }
    } catch (err: any) {
      console.error('Chat error:', err)
      if (err.message.includes("Upgrade required") || err.message.includes("403")) {
        setShowUpgradeModal(true)
      } else {
        toast.error(err.message || "Failed to connect to chat assistant.")
      }
    } finally {
      setIsLoadingChat(false)
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoadingChat])

  const suggestedPrompts = [
    { icon: <PenLine className="w-4 h-4 text-violet-400" />, text: "Help me outline a blog post about AI" },
    { icon: <Lightbulb className="w-4 h-4 text-fuchsia-400" />, text: "Give me 5 catchy titles for a startup" },
    { icon: <Sparkles className="w-4 h-4 text-blue-400" />, text: "Write a polite email to a client" },
  ]

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-br from-[#09090b] to-[#12121a]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-100 tracking-tight">WriteFlow Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-gray-400 font-medium">Online & Ready</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                <MessageSquare className="w-10 h-10 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">How can I help you today?</h1>
              <p className="text-gray-400 mb-10 max-w-md">
                I'm your personal AI writing assistant. I can help brainstorm ideas, structure content, or review your drafts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {suggestedPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubmit(undefined, prompt.text)}
                    className="flex flex-col items-start p-4 text-left rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all group"
                  >
                    <div className="mb-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                      {prompt.icon}
                    </div>
                    <span className="text-sm text-gray-300 font-medium leading-relaxed">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-md ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10' 
                      : 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
                  }`}>
                    {m.role === 'user' ? (
                      <User className="w-4 h-4 text-gray-300" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-sm border border-white/10' 
                      : 'bg-white/[0.03] border border-white/10 text-gray-200 rounded-tl-sm backdrop-blur-md'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                      {m.parts ? m.parts.map((part: any, idx: number) => {
                        if (part.type === 'text') {
                          return <span key={idx}>{part.text}</span>
                        }
                        return null
                      }) : <span>{(m as any).content}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoadingChat && messages[messages.length - 1]?.role === 'user' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 max-w-[85%]"
                >
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mt-1 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-200 rounded-tl-sm backdrop-blur-md flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span className="text-sm font-medium text-gray-400">Assistant is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-4 sm:p-6 shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-4xl mx-auto relative">
          {isLoadingChat && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => stop()}
                className="rounded-full bg-background/80 backdrop-blur border-white/10 hover:bg-white/5 text-xs text-gray-300"
              >
                Stop generating
              </Button>
            </div>
          )}
          
          <form 
            onSubmit={(e) => handleSubmit(e)} 
            className="relative flex items-end gap-2 bg-white/[0.03] border border-white/10 rounded-3xl p-2 shadow-2xl backdrop-blur-xl focus-within:ring-1 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all"
          >
            <Input 
              value={input}
              onChange={handleInputChange}
              placeholder="Ask WriteFlow Assistant anything..."
              className="w-full min-h-[52px] border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 px-4 text-base shadow-none resize-none"
              disabled={isLoadingChat}
              autoComplete="off"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoadingChat || !input.trim()}
              className="w-12 h-12 rounded-full shrink-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25 mb-0.5 mr-0.5"
            >
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </form>
          <div className="text-center mt-3 text-[11px] text-gray-500 font-medium tracking-wide">
            AI can make mistakes. Consider verifying important information.
          </div>
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
