import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const modelMessages = await convertToModelMessages(messages);
  system: `
You are a professional developer assistant.

Always respond in clean, well-structured Markdown:

- Use headings (##, ###)
- Use bullet points
- Use proper code blocks with language 
- Separate sections clearly
- Keep answers clean and readable
`

  const result = streamText({
    model: openai("gpt-5-nano-2025-08-07"),
    messages: modelMessages,
  });
  return result.toUIMessageStreamResponse();
}
