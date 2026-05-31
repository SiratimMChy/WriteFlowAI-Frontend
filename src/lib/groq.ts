import Groq from "groq-sdk"

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables")
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Default model - you can change this to other Groq models
// Available models: llama-3.3-70b-versatile, llama-3.1-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it
export const DEFAULT_MODEL = "llama-3.3-70b-versatile"
