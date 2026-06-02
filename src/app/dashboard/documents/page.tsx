"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { DocumentsClient } from "@/components/documents-client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Mocked response to prevent 404 console errors since documents module is not built
        const res = await Promise.resolve({ data: { success: true, data: [] } }) as any
        if (res.data.success) {
          setDocuments(res.data.data || [])
          if (res.data.meta) {
            setTotalPages(Math.ceil(res.data.meta.total / (res.data.meta.limit || 12)))
          }
        }
      } catch (err) {
        console.error("Documents fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-gray-400 mt-1">Manage and organize all your generated content.</p>
        </div>
        <Link href="/explore">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </Link>
      </div>
      <DocumentsClient documents={documents} totalPages={totalPages} />
    </div>
  )
}
