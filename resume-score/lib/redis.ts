type RedisResponse<T> = { result: T };

type RedisConfig = {
  url: string;
  token: string;
};

export function hasRedisConfig() {
  const { url, token } = getRedisConfig();
  return Boolean(url && token);
}

export async function redisCommand<T>(command: unknown[]): Promise<T> {
  const { url, token } = getRedisConfig();
  if (!url || !token) throw new Error("Redis is not configured.");

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(command),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Redis request failed: ${response.status}`);
  const json = (await response.json()) as RedisResponse<T>;
  return json.result;
}

function getRedisConfig(): RedisConfig {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
  };
}
