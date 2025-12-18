import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';
import wannaGeneralPrompt from "@/lib/utils/wannaPrompt";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = wannaGeneralPrompt;

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      messages: [
        {
            role: 'system',
            content: systemPrompt.trim()
        },
        ...convertToModelMessages(messages),
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return Response.json({ error: "Failed to stream text." }, { status: 500 });
  }
}