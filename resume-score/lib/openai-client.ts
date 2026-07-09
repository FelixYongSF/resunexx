import OpenAI from "openai";
import { fetch as undiciFetch, ProxyAgent } from "undici";

const OPENAI_TIMEOUT_MS = 105_000;

export function createOpenAiClient() {
  const proxyUrl = getProxyUrl();
  const configuredProxy = getConfiguredProxyUrl();

  console.info("[openai-client] initialized", {
    apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    openAiTimeoutMs: OPENAI_TIMEOUT_MS,
    proxyConfigured: Boolean(configuredProxy),
    proxyUsed: Boolean(proxyUrl),
    runtime: process.env.VERCEL === "1" ? "vercel" : "local"
  });

  if (!proxyUrl) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: OPENAI_TIMEOUT_MS,
      maxRetries: 0
    });
  }

  const dispatcher = new ProxyAgent(proxyUrl);

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
  if (process.env.VERCEL === "1") return "";
  return getConfiguredProxyUrl();
}

function getConfiguredProxyUrl() {
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
