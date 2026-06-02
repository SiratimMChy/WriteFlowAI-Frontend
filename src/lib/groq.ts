import Groq from "groq-sdk"

// Default model for server-side Groq calls
const defaultModel = "llama-3.3-70b-versatile";

let _groq: Groq | null = null

export function getGroq(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables")
  }
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return _groq
}
