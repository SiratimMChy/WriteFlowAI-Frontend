import { getGroq } from "@/lib/groq"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  let body: any = null;
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;

    // Check rate limits
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.plan === "free") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // @ts-ignore
      const usageCount = await prisma.aIUsageLog.count({
        where: {
          userId: userId,
          createdAt: { gte: startOfMonth }
        }
      });

      if (usageCount >= 10) {
        return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
      }
    }

    body = await req.json()
    console.log("Chat incoming body:", JSON.stringify(body, null, 2))
    const { messages } = body
    const groq = getGroq()

    const systemPrompt = "You are a helpful AI writing assistant embedded in a document editor. Help the user brainstorm, outline, or edit their content. Keep answers concise."

    const formattedMessages = messages.map((m: any) => {
      let textContent = m.content || "";
      
      // Handle the new AI SDK parts array
      if (Array.isArray(m.parts)) {
        textContent = m.parts.map((part: any) => part.text || '').join('');
      } else if (Array.isArray(m.content)) {
        textContent = m.content.map((part: any) => part.text || '').join('');
      } else if (typeof m.content === 'object' && m.content !== null) {
        textContent = JSON.stringify(m.content);
      }

      // Groq requires non-empty string
      if (!textContent) textContent = " ";

      return {
        role: m.role,
        content: textContent
      }
    })

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages
      ]
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`))
            }
          }
          
          // Log usage after successful generation
          // @ts-ignore
          await prisma.aIUsageLog.create({
            data: {
              userId: userId,
              agentUsed: "chat",
              promptSnippet: "Chat session",
              tokensUsed: 1 // Representing 1 request for simplicity
            }
          });
        } catch (err) {}
        controller.close()
      }
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'x-vercel-ai-data-stream': 'v1' } })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate chat response", stack: error instanceof Error ? error.stack : undefined, body: body }, { status: 500 })
  }
}
