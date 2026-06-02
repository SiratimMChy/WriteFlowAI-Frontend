"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageSquare, Send, User, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { getCookie } from "cookies-next"
import { useAuth } from "@/components/auth-provider"

export function ChatAgentClient() {
  const [input, setInput] = useState("")
  const { user } = useAuth()
  
  // Get headers function that will be called on each request
  const getHeaders = () => {
    let token = getCookie('token') as string | undefined
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined
    }
    
    console.log('Chat headers - Token found:', !!token) // Debug log
    
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }
  
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL || 'https://writeflowai-backend.onrender.com/api'}/ai/chat`,
      headers: getHeaders,
      // Prepare the request to match backend expectations
      prepareSendMessagesRequest: ({ messages }) => {
        const formattedMessages = messages.map(msg => {
          let content = ''
          if (msg.parts && msg.parts.length > 0) {
            content = msg.parts
              .filter(part => part.type === 'text')
              .map(part => (part as any).text)
              .join('')
          } else {
            content = (msg as any).content || ''
          }
          
          return {
            role: msg.role,
            content: content
          }
        })
        
        return {
          body: {
            messages: formattedMessages
          }
        }
      }
    }),
    onFinish: ({ messages }) => {
      console.log('Chat finished. All messages:', messages)
    },
    onError: (err: Error) => {
      console.error('Chat error:', err) // Debug log
      toast.error(err.message || "Failed to connect to chat assistant.")
    }
  })
  
  const { messages, sendMessage, status } = chat

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Check if user is authenticated
    const token = getCookie('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    if (!token) {
      toast.error("Please log in to use the chat assistant.")
      return
    }
    
    const userMessage = input
    setInput("")
    
    await sendMessage({ text: userMessage })
  }

  const isLoadingChat = status === 'streaming' || status === 'submitted'

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="p-4 sm:p-8 h-[calc(100vh-4rem)] flex flex-col items-center">
      <div className="w-full max-w-4xl h-full flex flex-col rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-200">WriteFlow Assistant</h2>
              <p className="text-xs text-gray-500">Always ready to brainstorm & assist</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <MessageSquare className="w-12 h-12 text-gray-600" />
              <p>Start a conversation to brainstorm ideas, ask for writing tips, or outline a new post.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto' : ''}`}>
                {m.role !== 'user' && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white/[0.05] border border-white/10 text-gray-200 rounded-tl-sm'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                    {m.parts ? m.parts.map((part, idx) => {
                      if (part.type === 'text') {
                        return <span key={idx}>{part.text}</span>
                      }
                      return null
                    }) : <span>{(m as any).content}</span>}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoadingChat && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-gray-200 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-gray-400">Assistant is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-black/50 border-t border-white/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input 
              value={input}
              onChange={handleInputChange}
              placeholder="Message WriteFlow Assistant..."
              className="w-full h-14 pl-6 pr-16 rounded-full bg-white/[0.05] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 text-base"
              disabled={isLoadingChat}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoadingChat || !input.trim()}
              className="absolute right-2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2 text-xs text-gray-600">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>

      </div>
    </div>
  )
}
