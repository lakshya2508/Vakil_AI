import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/anthropic";
import { chatRequestSchema, truncateHistory } from "@/lib/validation";
import { rateLimit, getClientKey } from "@/lib/rateLimit";
import { getCachedResponse, setCachedResponse } from "@/lib/cache";

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req);
  const limit = rateLimit(`chat:${clientKey}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt - Date.now()) / 1000).toString() } }
    );
  }

  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, webSearch, model } = parsed.data;
    const lastMsg = messages[messages.length - 1];

    // Fast-path: Check in-memory cache for instant < 10ms response
    if (lastMsg && (!lastMsg.attachments || lastMsg.attachments.length === 0)) {
      const cached = getCachedResponse(lastMsg.content, model, webSearch);
      if (cached) {
        return NextResponse.json({ content: cached, cached: true });
      }
    }

    const truncated = truncateHistory(messages);
    const content = await sendMessage({ messages: truncated, webSearch, model });

    // Store successful response in cache
    if (lastMsg && (!lastMsg.attachments || lastMsg.attachments.length === 0) && content) {
      setCachedResponse(lastMsg.content, model, webSearch, content);
    }

    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[chat/route]", message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
