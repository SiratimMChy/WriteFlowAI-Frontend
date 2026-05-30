import { Sparkles, Save, Copy, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DraftAgentPage() {
  return (
    <div className="p-8 h-full min-h-screen flex flex-col lg:flex-row gap-8">
      {/* Left Panel - Config */}
      <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Draft Agent
          </h1>
          <p className="text-gray-400 text-sm mt-1">Configure your AI writing assistant.</p>
        </div>

        <div className="space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="space-y-2">
            <Label className="text-gray-300">Topic or Prompt</Label>
            <textarea 
              className="w-full h-32 p-3 rounded-xl bg-black border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="What do you want to write about?"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Tone of Voice</Label>
            <select className="w-full h-12 px-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
              <option>Professional</option>
              <option>Casual</option>
              <option>Enthusiastic</option>
              <option>Informative</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Keywords (Optional)</Label>
            <Input 
              placeholder="e.g. AI, writing, productivity" 
              className="bg-black border-white/10 h-12 rounded-xl focus-visible:ring-violet-500"
            />
          </div>

          <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all">
            Generate Content
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] rounded-2xl bg-white/[0.01] border border-white/5 overflow-hidden">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.01]">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            Untitled Document
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto text-gray-500 text-center flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-violet-500/50" />
            </div>
            <p>Your generated content will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
