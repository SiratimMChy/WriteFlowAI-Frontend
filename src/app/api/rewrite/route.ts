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

  const { prompt, action, format } = await req.json()

  let actionInstruction = ""
  switch (action) {
    case "shorten":
      actionInstruction = "Make the text significantly shorter and more concise, keeping the core message."
      break
    case "lengthen":
      actionInstruction = "Expand on the text, adding more detail, examples, and depth."
      break
    case "professional":
      actionInstruction = "Rewrite the text to sound highly professional, formal, and corporate."
      break
    case "casual":
      actionInstruction = "Rewrite the text to sound friendly, approachable, and casual."
      break
    case "grammar":
      actionInstruction = "Fix all grammar, spelling, and punctuation errors. Improve flow."
      break
    default:
      actionInstruction = "Improve the overall quality of the text."
  }

  let formatInstruction = ""
  if (format === "bullets") {
    formatInstruction = "Format the output as a bulleted list."
  } else if (format === "paragraphs") {
    formatInstruction = "Format the output as well-structured paragraphs."
  }

  const systemMessage = `You are an expert AI editor. Your task is to rewrite the user's text based on their instructions. 
  Instruction: ${actionInstruction}
  ${formatInstruction}`

  // Log usage asynchronously
  prisma.aILog.create({
    data: {
      userId: session.user.id,
      agentUsed: "rewrite",
      promptSnippet: prompt.substring(0, 100),
      tokensUsed: 0
    }
  }).catch(console.error)

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemMessage,
    prompt: prompt,
  })

  return result.toTextStreamResponse()
}
