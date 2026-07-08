import OpenAI from "openai";
import { fetch as undiciFetch, ProxyAgent } from "undici";

const OPENAI_TIMEOUT_MS = 60_000;

export function createOpenAiClient() {
  const proxyUrl = getProxyUrl();

  if (!proxyUrl) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: OPENAI_TIMEOUT_MS,
      maxRetries: 0
    });
  }

  const dispatcher = new ProxyAgent(proxyUrl);

  if (process.env.NODE_ENV !== "production") {
    console.info("[openai-client] Using proxy for OpenAI requests.", {
      proxy: sanitizeProxyUrl(proxyUrl)
    });
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: OPENAI_TIMEOUT_MS,
    maxRetries: 0,
    fetch: ((input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
      return undiciFetch(input as Parameters<typeof undiciFetch>[0], {
        ...init,
        dispatcher
      } as Parameters<typeof undiciFetch>[1]);
    }) as unknown as typeof fetch
  });
}

export function getProxyUrl() {
  return (
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    ""
  );
}

function sanitizeProxyUrl(value: string) {
  return value.replace(/:\/\/[^@]+@/, "://***@");
}
