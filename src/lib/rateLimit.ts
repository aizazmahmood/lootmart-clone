import { NextResponse } from "next/server";

type Bucket = {
  tokens: number;
  lastRefillMs: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

// Best-effort in-memory rate limiter. For multi-region / multi-instance
// production, use a shared store (e.g. Redis/Upstash) for consistency.
export function rateLimit(
  request: Request,
  options: RateLimitOptions,
): NextResponse | null {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucketKey = `${options.key}:${ip}`;
  const windowMs = options.windowMs;
  const refillRate = options.limit / windowMs;

  const existing = buckets.get(bucketKey);
  const bucket: Bucket = existing ?? {
    tokens: options.limit,
    lastRefillMs: now,
  };

  const elapsed = Math.max(0, now - bucket.lastRefillMs);
  bucket.tokens = Math.min(
    options.limit,
    bucket.tokens + elapsed * refillRate,
  );
  bucket.lastRefillMs = now;

  if (bucket.tokens < 1) {
    buckets.set(bucketKey, bucket);
    const res = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  bucket.tokens -= 1;
  buckets.set(bucketKey, bucket);
  return null;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  const withIp = request as Request & { ip?: string };
  return withIp.ip ?? "unknown";
}
