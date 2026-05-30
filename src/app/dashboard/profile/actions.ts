"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const avatarUrl = formData.get("avatarUrl") as string

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        image: avatarUrl || undefined,
      }
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to update profile" }
  }
}
