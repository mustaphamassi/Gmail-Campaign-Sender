import { GoogleGenAI } from "@google/genai";
// FIX: The `Handler` type from `@netlify/functions` expects a string body,
// but this function returns a ReadableStream. To fix the resulting TypeScript
// error, the `Handler` type is removed from the function signature and the `event`
// parameter is explicitly typed with `HandlerEvent`. This allows TypeScript
// to correctly infer the streaming response type, which the Netlify runtime supports.
import type { HandlerEvent } from '@netlify/functions';

const handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'API_KEY environment variable not set on server' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const { prompt, existingContent } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return { statusCode: 400, body: 'Prompt is required' };
    }

    const fullPrompt = `Based on the following instruction, improve or create email content. The user's current draft is below the instruction. If the draft is empty, create a new one from scratch based on the instruction.
---
INSTRUCTION: "${prompt}"
---
CURRENT DRAFT:
${existingContent || ''}
---
Keep the tone professional yet engaging. Do not include a subject line, only the email body.`;

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });
    
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        controller.close();
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff", // Security header
      },
      body: readableStream,
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: `Error processing request: ${error.message}`
    };
  }
};

export { handler };
