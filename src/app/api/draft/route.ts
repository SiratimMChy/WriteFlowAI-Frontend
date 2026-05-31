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

  const { prompt, tone, keywords, templateId } = await req.json()

  let systemMessage = `You are a professional AI writer. Write comprehensive, high-quality content. The requested tone is: ${tone}.`
  if (keywords) {
    systemMessage += ` Please include the following keywords naturally: ${keywords}.`
  }

  // If a template is provided, we can fetch its system prompt
  if (templateId) {
    const template = await prisma.template.findUnique({ where: { id: templateId } })
    if (template) {
      systemMessage = `You are an expert ${template.category} writer. Generate a ${template.wordCount} text in a ${template.tone} tone. The user's input is a prompt or topic.`
      // Update template usage
      await prisma.template.update({
        where: { id: template.id },
        data: { usageCount: { increment: 1 } }
      })
    }
  }

  // Log usage asynchronously
  prisma.aILog.create({
    data: {
      userId: session.user.id,
      agentUsed: "draft",
      promptSnippet: prompt.substring(0, 100),
      tokensUsed: 0 // Will update or estimate later, ai-sdk handles streams, we just leave 0 or an estimate for now. 
    }
  }).catch(console.error)

  const completion = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ],
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
