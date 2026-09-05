import { absoluteUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/services";

export const dynamic = "force-static";

// llms.txt — an emerging convention (llmstxt.org): a concise Markdown map of
// the site for AI agents, pointing at the pages worth reading and citing.
export function GET() {
  const serviceLines = serviceSlugs
    .map((slug) => `- [${slugTitle(slug)}](${absoluteUrl(`/en/services/${slug}/`)})`)
    .join("\n");

  const body = `# Talea

> Talea is a China sourcing partner: product sourcing, supplier verification,
> quality control and inspection, procurement, warehousing/consolidation and
> freight out of China — handled by one accountable team on the ground, with
> offices in Shanghai and staff across Guangdong, Zhejiang and Fujian.
> 800+ containers shipped per year, 200+ people, 20+ years of experience.

The site is available in English (/en/), German (/de/) and Persian (/fa/).

## Services

${serviceLines}

## Key pages

- [Home](${absoluteUrl("/en/")}): what Talea does and how an engagement runs
- [FAQ](${absoluteUrl("/en/faq/")}): direct answers about sourcing from China, QC, shipping and warehousing
- [Contact](${absoluteUrl("/en/contact/")}): quick message or guided request form
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function slugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
