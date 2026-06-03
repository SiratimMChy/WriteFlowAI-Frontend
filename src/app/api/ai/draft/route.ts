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

    const { prompt, tone, keywords, templateId } = await req.json()
    const groq = getGroq()

    const systemPrompt = "You are a professional AI content writer. Output ONLY the drafted content, without conversational filler."
    const userPrompt = `Write about the following topic:\n${prompt}\n\nTone of voice: ${tone || 'Professional'}\n${keywords ? `Keywords to include: ${keywords}` : ''}`

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
        } catch (err) {}
        controller.close()
      }
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (error) {
    console.error("AI Draft Error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
