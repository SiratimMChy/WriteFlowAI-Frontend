"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function updateUserRole(userId: string, newRole: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  // Prevent admin from downgrading themselves
  if (userId === session.user.id) {
    return { error: "Cannot change your own role" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })
    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update role" }
  }
}

export async function toggleUserStatus(userId: string, currentStatus: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" }
  }

  if (userId === session.user.id) {
    return { error: "Cannot ban yourself" }
  }

  const newStatus = currentStatus === "active" ? "banned" : "active"

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus }
    })
    revalidatePath("/dashboard/admin/users")
    return { success: true, newStatus }
  } catch (error) {
    return { error: "Failed to update status" }
  }
}
