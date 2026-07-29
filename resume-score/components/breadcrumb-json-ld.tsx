import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/seo";

export function BreadcrumbJsonLd({ label, path }: { label: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: label, item: absoluteUrl(path) }
        ]
      }}
    />
  );
}
