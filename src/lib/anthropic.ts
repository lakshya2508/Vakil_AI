import { SYSTEM_PROMPT, PROMPTS_BY_MODEL } from "@/constants/data";
import { Attachment, AIModel } from "@/types";

/**
 * Google Gemini API integration with model-specific prompts and configurations.
 * Supports:
 * - Nyay Standard: Fast practical legal advisory & action items
 * - Nyay Research: Exhaustive statutory mapping (BNS/IPC) & precedent ratio decidendi
 * - Nyay Pro: High-stakes judicial opinions & dual-party argument synthesis
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

if (!GEMINI_API_KEY) {
  console.error("[lib/gemini] GEMINI_API_KEY is not set");
}

export interface SendMessageParams {
  messages: {
    role: "user" | "assistant";
    content: string;
    attachments?: Attachment[];
  }[];
  webSearch?: boolean;
  model?: AIModel;
}

/**
 * Call Gemini REST API with model-specific configuration.
 */
async function geminiChat(
  messages: SendMessageParams["messages"],
  selectedModel: AIModel = "Nyay Pro",
  webSearch?: boolean
): Promise<string> {
  const modelConfig = PROMPTS_BY_MODEL[selectedModel] || PROMPTS_BY_MODEL["Nyay Pro"];

  const contents = messages.map((m) => {
    const parts: Record<string, unknown>[] = [];

    // Process attachments into Gemini inline_data
    if (m.attachments && m.attachments.length > 0) {
      for (const att of m.attachments) {
        if (att.data) {
          const cleanBase64 = att.data.includes(",") ? att.data.split(",")[1] : att.data;
          parts.push({
            inline_data: {
              mime_type: att.mimeType,
              data: cleanBase64,
            },
          });
        }
      }
    }

    const textContent = m.content || (m.attachments?.length ? "Analyze attached media." : "");
    parts.push({ text: textContent });

    return {
      role: m.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  let finalSystemPrompt = modelConfig.prompt;
  if (webSearch) {
    finalSystemPrompt += "\n\n[WEB SEARCH ACTIVE]: Perform thorough research across Indian law portals, High Courts, and Supreme Court case databases.";
  }

  const body: Record<string, unknown> = {
    contents,
    system_instruction: {
      parts: [{ text: finalSystemPrompt }],
    },
    generationConfig: {
      temperature: modelConfig.temp,
      topP: 0.85,
      maxOutputTokens: modelConfig.maxTokens,
    },
  };

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "unknown");
        throw new Error(`Gemini API (${model}) returned ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error(`Empty response from Gemini model ${model}`);
      }

      // Clean raw markdown hashes if present
      text = text.replace(/^#{1,6}\s*/gm, "");

      return text;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[lib/gemini] Model ${model} failed, trying next fallback:`, lastError.message);
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content.");
}

// ── Public API ──

export async function sendMessage({ messages, model, webSearch }: SendMessageParams): Promise<string> {
  return geminiChat(messages, model, webSearch);
}

export async function complete(prompt: string, _maxTokens = 2000): Promise<string> {
  return geminiChat([{ role: "user", content: prompt }], "Nyay Pro");
}
