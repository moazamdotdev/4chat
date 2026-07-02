import { streamText, UIMessage, convertToModelMessages } from "ai"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    model,
    messages,
    webSearch,
  }: {
    messages: UIMessage[]
    model: string
    webSearch?: boolean
  } = await req.json()

  const result = streamText({
    model: webSearch ? "perplexity/sonar" : model,
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
  })

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
