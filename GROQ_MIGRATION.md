# Migration from OpenAI to Groq AI

This document outlines the changes made to migrate WriteFlow AI from OpenAI to Groq AI.

## Changes Made

### 1. Dependencies
- **Added**: `groq-sdk` package
- **Kept**: `@ai-sdk/openai`, `@ai-sdk/react`, and `ai` packages (can be removed if not used elsewhere)

### 2. Environment Variables
- **Changed**: `OPENAI_API_KEY` → `GROQ_API_KEY`
- Update your `.env` file with your Groq API key

### 3. New Files
- **`src/lib/groq.ts`**: Groq client configuration with default model settings

### 4. Updated API Routes
All three AI-powered routes have been updated to use Groq:
- `src/app/api/chat/route.ts`
- `src/app/api/draft/route.ts`
- `src/app/api/rewrite/route.ts`

## Setup Instructions

### 1. Get Your Groq API Key
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key

### 2. Update Environment Variables
Update your `.env` file:
```env
GROQ_API_KEY="your-groq-api-key-here"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```

## Available Groq Models

You can change the model in `src/lib/groq.ts`. Available models include:

- **`llama-3.3-70b-versatile`** (default) - Latest Llama model, great for general tasks
- **`llama-3.1-70b-versatile`** - Previous Llama version
- **`mixtral-8x7b-32768`** - Mixtral model with large context window
- **`gemma2-9b-it`** - Smaller, faster model

To change the model, edit the `DEFAULT_MODEL` constant in `src/lib/groq.ts`:
```typescript
export const DEFAULT_MODEL = "llama-3.3-70b-versatile"
```

## Benefits of Groq

1. **Speed**: Groq provides extremely fast inference times
2. **Cost**: Generally more cost-effective than OpenAI
3. **Open Models**: Uses open-source models like Llama and Mixtral
4. **No Rate Limits**: More generous rate limits on free tier

## Differences from OpenAI

- Groq uses open-source models instead of GPT models
- Response quality may vary depending on the task
- Some advanced features like function calling may differ
- Streaming implementation is handled manually instead of using Vercel AI SDK

## Troubleshooting

### Error: "GROQ_API_KEY is not set"
Make sure you've added `GROQ_API_KEY` to your `.env` file.

### Streaming not working
The streaming implementation uses native ReadableStream. Ensure your client-side code properly handles text/plain streaming responses.

### Model not found
Check that the model name in `src/lib/groq.ts` matches one of the available Groq models.

## Optional Cleanup

If you're not using OpenAI anywhere else in the project, you can remove these packages:
```bash
npm uninstall @ai-sdk/openai
```

However, you may want to keep `ai` and `@ai-sdk/react` if they're used in client components.
