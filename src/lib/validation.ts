import { z } from "zod";

// Shared limits — keep prompts bounded to control cost, latency, and
// prompt-injection surface area.
export const MAX_MESSAGE_LENGTH = 8_000;
export const MAX_HISTORY_MESSAGES = 30;
export const MAX_CONTRACT_LENGTH = 50_000;
export const MAX_FIELD_LENGTH = 2_000;

export const attachmentSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "audio", "file"]),
  name: z.string(),
  mimeType: z.string(),
  data: z.string(),
  previewUrl: z.string().optional(),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_MESSAGE_LENGTH),
        attachments: z.array(attachmentSchema).optional(),
      })
    )
    .min(1)
    .max(MAX_HISTORY_MESSAGES, {
      message: `Conversation history is limited to ${MAX_HISTORY_MESSAGES} messages`,
    }),
  webSearch: z.boolean().optional(),
  model: z.enum(["Nyay Pro", "Nyay Standard", "Nyay Research"]).optional(),
});

export const analyzeRequestSchema = z.object({
  text: z.string().min(1).max(MAX_CONTRACT_LENGTH),
});

export const documentRequestSchema = z.object({
  templateTitle: z.string().min(1).max(200),
  fields: z.record(z.string().max(MAX_FIELD_LENGTH)).default({}),
});

/** Keep only the most recent N messages to bound prompt size/cost. */
export function truncateHistory<T>(messages: T[], max = MAX_HISTORY_MESSAGES): T[] {
  return messages.length > max ? messages.slice(messages.length - max) : messages;
}
