type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

import { hasRedisConfig, redisCommand } from "@/lib/redis";

export type RateLimitResult = {
  allowed: boolean;
  available: boolean;
  remaining: number;
  resetAt: number;
};

const INCREMENT_WITH_TTL = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
  "return count"
].join("\n");

export async function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  const resetAt = Date.now() + windowMs;
  if (!hasRedisConfig()) {
    console.error("[rate-limit] Redis is not configured.");
    return { allowed: false, available: false, remaining: 0, resetAt };
  }

  try {
    const count = await redisCommand<number>([
      "EVAL",
      INCREMENT_WITH_TTL,
      1,
      `rate-limit:${key}`,
      windowMs
    ]);
    return {
      allowed: count <= limit,
      available: true,
      remaining: Math.max(0, limit - count),
      resetAt
    };
  } catch (error) {
    console.error("[rate-limit] Redis request failed.", {
      message: error instanceof Error ? error.message : "Unknown Redis error."
    });
    return { allowed: false, available: false, remaining: 0, resetAt };
  }
}

export function getRequestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
