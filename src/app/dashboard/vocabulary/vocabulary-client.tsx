"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Trash2, BookOpen, CheckCircle, RefreshCcw, Brain, Volume2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

type VocabularyWord = {
  id: string
  word: string
  definition: string
  example: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export function VocabularyClient({ initialWords }: { initialWords: VocabularyWord[] }) {
  const [words, setWords] = useState<VocabularyWord[]>(initialWords)
  const [activeFlashcard, setActiveFlashcard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const learningWords = words.filter(w => w.status === 'learning')
  const masteredWords = words.filter(w => w.status === 'mastered')

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)
      const res = await fetch(`/api/vocabulary/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setWords(prev => prev.filter(w => w.id !== id))
      toast.success("Word removed from vault")
    } catch (error) {
      toast.error("Failed to delete word")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/vocabulary/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setWords(prev => prev.map(w => w.id === id ? data.vocabularyWord : w))
      toast.success(`Marked as ${status}`)
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  const nextFlashcard = () => {
    setIsFlipped(false)
    setActiveFlashcard((prev) => (prev + 1) % learningWords.length)
  }

  const prevFlashcard = () => {
    setIsFlipped(false)
    setActiveFlashcard((prev) => (prev - 1 + learningWords.length) % learningWords.length)
  }

  return (
    <Tabs defaultValue="vault" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#0f0f0f] border border-white/10">
        <TabsTrigger value="vault" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
          <BookOpen className="w-4 h-4 mr-2" />
          My Vault
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          <Brain className="w-4 h-4 mr-2" />
          Flashcards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vault" className="mt-6 space-y-6">
        {words.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Your vault is empty</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Highlight words in your documents to save them here for later practice.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {words.map((word) => (
              <Card key={word.id} className="bg-[#0f0f0f] border-white/10 overflow-hidden flex flex-col">
                <CardHeader className="pb-3 border-b border-white/5 relative">
                  <div className="flex justify-between items-start pr-8">
                    <CardTitle className="text-xl text-white font-bold tracking-wide capitalize flex items-center gap-2">
                      {word.word}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => speakWord(word.word)}>
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                    <div className="absolute top-4 right-4">
                      {word.status === 'mastered' ? (
                        <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mastered
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-medium text-pink-400 bg-pink-400/10 px-2 py-1 rounded-full">
                          Learning
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <p className="text-gray-300 text-sm">{word.definition}</p>
                  {word.example && (
                    <div className="mt-3 pl-3 border-l-2 border-white/10 text-gray-500 text-sm italic">
                      "{word.example}"
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-3 border-t border-white/5 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-300"
                    onClick={() => handleUpdateStatus(word.id, word.status === 'mastered' ? 'learning' : 'mastered')}
                  >
                    {word.status === 'mastered' ? 'Need Practice' : 'Mark Mastered'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-500 hover:text-red-400 hover:bg-red-400/10"
                    disabled={isDeleting === word.id}
                    onClick={() => handleDelete(word.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="flashcards" className="mt-6">
        {learningWords.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">You've mastered everything!</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Add more words to your vault to continue practicing.
            </p>
            <Button variant="outline" className="mt-6 border-white/10" onClick={() => {
              const tabList = document.querySelector('[value="vault"]') as HTMLElement;
              tabList?.click();
            }}>
              View Vault
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-full flex justify-between items-center mb-6 px-4">
              <span className="text-sm font-medium text-gray-400">
                Card {activeFlashcard + 1} of {learningWords.length}
              </span>
              <span className="text-sm font-medium text-pink-400">
                {masteredWords.length} Mastered
              </span>
            </div>

            <div 
              className="w-full h-80 relative cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <AnimatePresence initial={false} mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <h2 className="text-4xl md:text-5xl font-bold text-white capitalize mb-4">
                      {learningWords[activeFlashcard].word}
                    </h2>
                    <p className="text-gray-500 flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Click to flip
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
                  >
                    <div className="max-w-md">
                      <h3 className="text-xl font-semibold text-white mb-4">Definition</h3>
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {learningWords[activeFlashcard].definition}
                      </p>
                      
                      {learningWords[activeFlashcard].example && (
                        <>
                          <div className="w-12 h-px bg-white/20 mx-auto my-6" />
                          <p className="text-md text-gray-400 italic">
                            "{learningWords[activeFlashcard].example}"
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-8 w-full">
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-white/10 h-14"
                onClick={prevFlashcard}
              >
                Previous
              </Button>
              <Button 
                variant="default" 
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 h-14"
                onClick={() => {
                  handleUpdateStatus(learningWords[activeFlashcard].id, 'mastered');
                  if (learningWords.length > 1) {
                    nextFlashcard();
                  }
                }}
              >
                I knew this
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-white/10 h-14"
                onClick={nextFlashcard}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
