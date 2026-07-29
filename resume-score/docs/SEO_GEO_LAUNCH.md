# ResuNexx SEO and GEO Launch

## What deploys automatically

- Server-rendered Resume Resources pages with Article, FAQPage, BreadcrumbList, Organization, WebSite, WebApplication, Product, and Offer structured data.
- Canonical URLs, Open Graph/Twitter metadata, sitemap, robots rules, and an RSS feed at `/feed.xml`.
- A weekly IndexNow notification for every public marketing and resource URL.

## One-time production configuration

1. Set `INDEXNOW_KEY` to a random 8-128 character key using letters, numbers, or dashes.
2. Set `CRON_SECRET` or `INDEXNOW_CRON_SECRET` to a separate long random value.
3. Deploy. Confirm `https://www.resunexx.com/indexnow-key.txt` returns the IndexNow key.
4. In Google Search Console, verify `https://www.resunexx.com` and submit `https://www.resunexx.com/sitemap.xml` once. Google uses the sitemap for future discovery and reporting.
5. Import the verified Google property into Bing Webmaster Tools. Bing imports the site and sitemap; IndexNow then notifies participating search engines after content changes.

## Boundaries

IndexNow improves discovery speed; it does not guarantee indexing, rankings, citations, or traffic. Search Console and Bing ownership are intentionally owner-controlled. Automatic posting to third-party communities is not enabled because it would require account-level permissions and can become spam.
