import { GoogleGenerativeAI } from "@google/generative-ai"

// Default model - you can change this to other Gemini models
// Available models: gemini-1.5-pro, gemini-1.5-flash
export const DEFAULT_MODEL = "gemini-1.5-pro"

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables")
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

export const genAI = {
  getGenerativeModel: (params: Parameters<GoogleGenerativeAI["getGenerativeModel"]>[0]) => {
    return getGenAI().getGenerativeModel(params)
  }
}
