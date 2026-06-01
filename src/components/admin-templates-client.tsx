"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Plus, Edit, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function AdminTemplatesClient({ templates, totalPages }: { templates: any[], totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const currentPage = Number(searchParams.get("page")) || 1

  const [editingTemplate, setEditingTemplate] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const updateUrl = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") current.delete(key)
      else current.set(key, value)
    })
    if (params.page === undefined) current.set("page", "1")
    const search = current.toString()
    startTransition(() => router.push(`${pathname}${search ? `?${search}` : ""}`))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return
    startTransition(async () => {
      try {
        const res = await api.delete(`/items/${id}`)
        if (res.data.success) {
          toast.success("Template deleted")
          router.refresh()
        } else {
          toast.error(res.data.message || "Failed to delete template")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete template")
      }
    })
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      wordCount: formData.get("wordCount") || "500 words",
      tone: formData.get("tone") || "Professional",
      aiModel: formData.get("aiModel") || "GPT-4",
      description: formData.get("description"),
      sampleOutput: formData.get("sampleOutput") || "Sample text...",
      prompt: `You are an expert ${formData.get("category")} writer. Write a ${formData.get("wordCount") || "500 words"} text in a ${formData.get("tone") || "Professional"} tone.`
    }

    startTransition(async () => {
      try {
        const res = editingTemplate?.id
          ? await api.patch(`/items/${editingTemplate.id}`, data)
          : await api.post("/items", data)
        
        if (res.data.success) {
          toast.success(editingTemplate ? "Template updated" : "Template created")
          setEditingTemplate(null)
          setIsCreating(false)
          router.refresh()
        } else {
          toast.error(res.data.message || "Failed to save template")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to save template")
      }
    })
  }

  if (isCreating || editingTemplate) {
    const t = editingTemplate || {}
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{isCreating ? "Create New Template" : "Edit Template"}</h2>
          <Button variant="ghost" size="icon" onClick={() => { setIsCreating(false); setEditingTemplate(null); }}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={t.title} required className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input name="category" defaultValue={t.category} required className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Default Word Count</Label>
              <Input name="wordCount" defaultValue={t.wordCount} className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Input name="tone" defaultValue={t.tone} className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Input name="aiModel" defaultValue={t.aiModel} className="bg-black/50 border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" defaultValue={t.description} required className="bg-black/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Sample Output</Label>
            <Textarea name="sampleOutput" defaultValue={t.sampleOutput} className="bg-black/50 border-white/10 min-h-[150px]" />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingTemplate(null); }}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); updateUrl({ q: query }) }} className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search templates..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/10 text-white h-12 rounded-xl"
          />
        </form>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto h-12">
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-4 font-medium text-gray-400">Title</th>
                <th className="p-4 font-medium text-gray-400">Category</th>
                <th className="p-4 font-medium text-gray-400">Usage</th>
                <th className="p-4 font-medium text-gray-400">Rating</th>
                <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={isPending ? "opacity-50 pointer-events-none" : ""}>
              {templates.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-white/5 rounded text-xs">{t.category}</span></td>
                  <td className="p-4 text-gray-400 text-sm">{t.usageCount.toLocaleString()}</td>
                  <td className="p-4 text-yellow-400 text-sm">★ {t.rating.toFixed(1)}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(t)} className="text-gray-400 hover:text-white mr-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {templates.length === 0 && <div className="p-8 text-center text-gray-500">No templates found.</div>}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button disabled={currentPage <= 1 || isPending} onClick={() => updateUrl({ page: String(currentPage - 1) })} className="px-3 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm">Prev</button>
          <button disabled={currentPage >= totalPages || isPending} onClick={() => updateUrl({ page: String(currentPage + 1) })} className="px-3 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm">Next</button>
        </div>
      )}
    </div>
  )
}
