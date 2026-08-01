import {
  chatRequestSchema,
  analyzeRequestSchema,
  documentRequestSchema,
  truncateHistory,
  MAX_HISTORY_MESSAGES,
} from "@/lib/validation";

describe("chatRequestSchema", () => {
  it("accepts a valid payload", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty messages array", () => {
    const result = chatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a message with an invalid role", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "system", content: "Hello" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an over-long message", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "a".repeat(10_000) }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing messages field", () => {
    const result = chatRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("analyzeRequestSchema", () => {
  it("accepts non-empty contract text", () => {
    expect(analyzeRequestSchema.safeParse({ text: "Sample contract" }).success).toBe(true);
  });

  it("rejects empty text", () => {
    expect(analyzeRequestSchema.safeParse({ text: "" }).success).toBe(false);
  });
});

describe("documentRequestSchema", () => {
  it("accepts a valid payload with fields", () => {
    const result = documentRequestSchema.safeParse({
      templateTitle: "NDA",
      fields: { partyA: "Acme Corp" },
    });
    expect(result.success).toBe(true);
  });

  it("defaults fields to an empty object when omitted", () => {
    const result = documentRequestSchema.safeParse({ templateTitle: "NDA" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fields).toEqual({});
  });

  it("rejects a missing templateTitle", () => {
    expect(documentRequestSchema.safeParse({ fields: {} }).success).toBe(false);
  });
});

describe("truncateHistory", () => {
  it("returns the array unchanged when under the limit", () => {
    const messages = [1, 2, 3];
    expect(truncateHistory(messages)).toEqual([1, 2, 3]);
  });

  it("keeps only the most recent N messages when over the limit", () => {
    const messages = Array.from({ length: MAX_HISTORY_MESSAGES + 10 }, (_, i) => i);
    const result = truncateHistory(messages);
    expect(result.length).toBe(MAX_HISTORY_MESSAGES);
    expect(result[result.length - 1]).toBe(MAX_HISTORY_MESSAGES + 9);
  });
});
