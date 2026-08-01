import { rateLimit } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    const key = "test-under-limit";
    for (let i = 0; i < 5; i++) {
      const result = rateLimit(key, 5, 60_000);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = "test-over-limit";
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000);
    const result = rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after the window expires", async () => {
    const key = "test-window-reset";
    rateLimit(key, 1, 10);
    const blocked = rateLimit(key, 1, 10);
    expect(blocked.allowed).toBe(false);

    await new Promise(res => setTimeout(res, 20));

    const allowedAgain = rateLimit(key, 1, 10);
    expect(allowedAgain.allowed).toBe(true);
  });

  it("tracks separate buckets per key", () => {
    const a = rateLimit("bucket-a", 1, 60_000);
    const b = rateLimit("bucket-b", 1, 60_000);
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });
});
