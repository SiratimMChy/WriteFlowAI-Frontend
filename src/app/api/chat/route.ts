import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages } = await req.json()

  // Extract the latest user message for logging
  const latestMessage = messages[messages.length - 1]

  if (latestMessage?.role === "user") {
    // Log usage asynchronously
    prisma.aILog.create({
      data: {
        userId: session.user.id,
        agentUsed: "chat",
        promptSnippet: latestMessage.content.substring(0, 100),
        tokensUsed: 0
      }
    }).catch(console.error)
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful and expert AI writing assistant named WriteFlow AI. You help users brainstorm, outline, and refine their content. Be concise and friendly.",
    messages: messages,
  })

  return result.toTextStreamResponse()
}
