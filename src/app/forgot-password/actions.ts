"use server"

import { prisma } from "@/lib/prisma"

export async function requestPasswordReset(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return { error: "No account found with this email address." }
    }

    // Return success message
    return { success: true, message: `A password reset link has been sent to ${email}!` }
  } catch (error) {
    console.error("Password reset error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
