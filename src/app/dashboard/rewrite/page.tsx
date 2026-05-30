import { Wand2, Copy, Save, Sparkles, Zap, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RewriteAgentPage() {
  return (
    <div className="p-8 h-full min-h-screen flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-violet-500" />
          Rewrite Agent
        </h1>
        <p className="text-gray-400 text-sm mt-1">Enhance, rephrase, or adjust the tone of your existing text.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        {/* Left - Input */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
          <div className="h-14 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
            <span className="text-sm font-medium text-gray-300">Original Text</span>
          </div>
          <textarea 
            className="flex-1 w-full p-6 bg-transparent text-white placeholder:text-gray-600 focus:outline-none resize-none leading-relaxed"
            placeholder="Paste the text you want to rewrite here..."
          />
          <div className="p-4 border-t border-white/5 bg-white/[0.01] grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" className="bg-white/[0.02] border-white/5 text-gray-300 hover:text-white hover:bg-white/[0.05]">
              <Minimize className="w-4 h-4 mr-2" /> Shorter
            </Button>
            <Button variant="outline" className="bg-white/[0.02] border-white/5 text-gray-300 hover:text-white hover:bg-white/[0.05]">
              <Maximize className="w-4 h-4 mr-2" /> Longer
            </Button>
            <Button variant="outline" className="bg-white/[0.02] border-white/5 text-gray-300 hover:text-white hover:bg-white/[0.05]">
              <Sparkles className="w-4 h-4 mr-2" /> Better
            </Button>
            <Button variant="outline" className="bg-violet-600/20 border-violet-500/30 text-violet-300 hover:bg-violet-600/30 hover:text-violet-200">
              <Zap className="w-4 h-4 mr-2" /> Rewrite
            </Button>
          </div>
        </div>

        {/* Right - Output */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden relative group">
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
            <span className="text-sm font-medium text-gray-300">Rewritten Text</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6 text-gray-500 flex items-center justify-center text-center">
            Paste some text and select an action to see the rewritten result.
          </div>
        </div>
      </div>
    </div>
  )
}
