
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* improveEmailContent(prompt: string, existingContent: string): AsyncGenerator<string> {
  try {
    const fullPrompt = `Based on the following instruction, improve or create email content. The user's current draft is below the instruction. If the draft is empty, create a new one from scratch based on the instruction.
---
INSTRUCTION: "${prompt}"
---
CURRENT DRAFT:
${existingContent}
---
Keep the tone professional yet engaging. Do not include a subject line, only the email body.`;
    
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    yield "Sorry, I encountered an error while improving the content. Please try again.";
  }
}
