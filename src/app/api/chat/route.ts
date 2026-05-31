import { groq, DEFAULT_MODEL } from "@/lib/groq"
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

  const systemMessage = "You are a helpful and expert AI writing assistant named WriteFlow AI. You help users brainstorm, outline, and refine their content. Be concise and friendly."
  
  const chatMessages = [
    { role: "system" as const, content: systemMessage },
    ...messages
  ]

  const completion = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: chatMessages,
    stream: true,
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  })
}
