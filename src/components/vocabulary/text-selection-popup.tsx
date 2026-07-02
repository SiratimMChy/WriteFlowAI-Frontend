"use client"

import { useEffect, useState, useRef } from "react"
import { BookPlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"

export function TextSelectionPopup() {
  const [selectedText, setSelectedText] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [definition, setDefinition] = useState<{word: string, meaning: string, example?: string} | null>(null)

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Don't hide if clicking inside the popup
      const target = e.target as HTMLElement;
      if (target.closest("#vocabulary-popup")) return;

      setTimeout(() => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()
        
        // We only care about single words or short phrases (max 3 words)
        if (text && text.length > 1 && text.split(" ").length <= 3) {
          const range = selection?.getRangeAt(0)
          const rect = range?.getBoundingClientRect()
          
          if (rect) {
            setSelectedText(text)
            setPosition({
              x: rect.left + rect.width / 2,
              y: rect.top + window.scrollY - 10 // Position above the text
            })
            setShowPopup(true)
            setDefinition(null)
          }
        } else {
          setShowPopup(false)
          setDefinition(null)
        }
      }, 50)
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleFetchDefinition = async () => {
    setIsLoading(true)
    try {
      // Use free dictionary API
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`)
      if (!res.ok) throw new Error("Word not found")
      const data = await res.json()
      
      const meaning = data[0].meanings[0].definitions[0].definition
      const example = data[0].meanings[0].definitions[0].example

      setDefinition({
        word: data[0].word,
        meaning,
        example
      })
    } catch (error) {
      toast.error("Could not find definition.")
      setShowPopup(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToVault = async () => {
    if (!definition) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: definition.word,
          definition: definition.meaning,
          example: definition.example
        })
      })
      
      const data = await res.json()
      if (res.ok) {
        if (data.error === "Word already exists in vault") {
          toast.info("This word is already in your Vault")
        } else {
          toast.success("Added to Vocabulary Vault!")
        }
        setShowPopup(false)
        setDefinition(null)
      } else {
        toast.error("Failed to save word")
      }
    } catch (error) {
      toast.error("Error saving word")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          id="vocabulary-popup"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -100%)",
            zIndex: 9999
          }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px] max-w-[300px]"
        >
          {definition ? (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white capitalize text-lg">{definition.word}</h4>
                <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-300">{definition.meaning}</p>
              <Button 
                size="sm" 
                onClick={handleSaveToVault} 
                disabled={isLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white mt-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save to Vault"}
              </Button>
            </div>
          ) : (
            <div className="p-2 flex gap-2 items-center bg-[#1a1a1a]">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10"
                onClick={handleFetchDefinition}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BookPlus className="w-4 h-4 mr-2" />}
                Define "{selectedText.substring(0, 15)}{selectedText.length > 15 ? '...' : ''}"
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
