import { indexNowKeyLocation, publicSeoUrls } from "@/lib/seo-indexing";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";

function hasValidCronSecret(request: Request) {
  const secret = process.env.INDEXNOW_CRON_SECRET || process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!hasValidCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return Response.json({ error: "IndexNow is not configured." }, { status: 503 });
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(siteUrl).host,
      key,
      keyLocation: indexNowKeyLocation(),
      urlList: publicSeoUrls
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return Response.json({ error: "IndexNow did not accept the URL notification.", status: response.status }, { status: 502 });
  }

  return Response.json({ submitted: publicSeoUrls.length, status: response.status });
}
