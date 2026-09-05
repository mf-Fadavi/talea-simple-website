import { absoluteUrl, siteName, siteUrl } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: `${siteUrl}/`,
    logo: absoluteUrl("/images/talea-logo-icon.svg"),
    description:
      "China sourcing partner: product sourcing, supplier verification, quality control, procurement, warehousing and freight — one accountable team on the ground in China.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shanghai",
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@talea.com",
      telephone: "+86-21-1234-5678",
      availableLanguage: ["en", "de", "fa", "zh"],
    },
    areaServed: ["Europe", "Middle East", "North America", "Africa", "Asia-Pacific"],
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 200 },
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: ["Europe", "Middle East", "North America", "Africa", "Asia-Pacific"],
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
