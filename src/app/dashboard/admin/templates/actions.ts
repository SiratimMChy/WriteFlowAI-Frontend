"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function deleteTemplate(templateId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.template.delete({
      where: { id: templateId }
    })
    revalidatePath("/dashboard/admin/templates")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete template" }
  }
}

export async function saveTemplate(formData: FormData, templateId?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const wordCount = formData.get("wordCount") as string
  const tone = formData.get("tone") as string
  const aiModel = formData.get("aiModel") as string
  const sampleOutput = formData.get("sampleOutput") as string

  if (!title || !description || !category) {
    return { error: "Missing required fields" }
  }

  try {
    const data = {
      title,
      description,
      category,
      wordCount: wordCount || "500 words",
      tone: tone || "Professional",
      aiModel: aiModel || "GPT-4",
      sampleOutput: sampleOutput || "Sample text...",
      systemPrompt: `You are an expert ${category} writer. Write a ${wordCount} text in a ${tone} tone.`
    }

    if (templateId) {
      await prisma.template.update({
        where: { id: templateId },
        data
      })
    } else {
      await prisma.template.create({
        data
      })
    }
    
    revalidatePath("/dashboard/admin/templates")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save template" }
  }
}
