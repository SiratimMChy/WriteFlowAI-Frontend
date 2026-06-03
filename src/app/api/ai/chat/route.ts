import { getGroq } from "@/lib/groq"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages } = await req.json()
    const groq = getGroq()

    const systemPrompt = "You are a helpful AI writing assistant embedded in a document editor. Help the user brainstorm, outline, or edit their content. Keep answers concise."

    const formattedMessages = messages.map((m: any) => {
      let textContent = m.content;
      if (Array.isArray(m.content)) {
        textContent = m.content.map((part: any) => part.text || '').join('');
      } else if (typeof m.content === 'object' && m.content !== null) {
        textContent = JSON.stringify(m.content);
      }
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
        } catch (err) {}
        controller.close()
      }
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'x-vercel-ai-data-stream': 'v1' } })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 })
  }
}
