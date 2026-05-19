// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const haveUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = haveUpstash ? Redis.fromEnv() : null;

export type RateLimitAction =
  | "upload"
  | "confirm"
  | "list"
  | "delete"
  | "download"
  | "storage-info"
  | "feedback";

const limiters: Partial<Record<RateLimitAction, Ratelimit>> = {};

if (redis) {
  limiters.upload = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "rl:upload",
    analytics: false,
  });
  limiters.confirm = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "rl:confirm",
    analytics: false,
  });
  limiters.list = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:list",
    analytics: false,
  });
  limiters.delete = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:delete",
    analytics: false,
  });
  limiters.download = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:download",
    analytics: false,
  });
  limiters["storage-info"] = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:storage",
    analytics: false,
  });
  limiters.feedback = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "rl:feedback",
    analytics: false,
  });
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting is DISABLED.",
  );
}

/**
 * `key`    — Clerk userId for authenticated actions, IP for public ones.
 * `action` — which limiter bucket to use.
 *
 * No-ops gracefully when Upstash env vars aren't configured.
 */
export async function checkRateLimit(
  key: string,
  action: RateLimitAction,
): Promise<void> {
  const limiter = limiters[action];
  if (!limiter) return;
  const { success } = await limiter.limit(key);
  if (!success) {
    throw new Error("Too many requests. Please slow down and try again.");
  }
}
