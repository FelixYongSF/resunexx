const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#151515"/><circle cx="32" cy="32" r="20" fill="none" stroke="#d7ff4f" stroke-width="3"/><path d="M24 43V21h9.5c6.2 0 10.5 3.9 10.5 10.5S39.7 42 33.5 42H29v1h-5Zm5-6h4.2c3.5 0 5.6-1.9 5.6-5.5S36.7 26 33.2 26H29v11Z" fill="#f3f0e9"/></svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
}
