import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/services";

export const dynamic = "force-static";

// Locale-relative paths ("" = home) with their relative priority.
const pages: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  ...serviceSlugs.map((slug) => ({ path: `services/${slug}`, priority: 0.9 })),
  { path: "faq", priority: 0.8 },
  { path: "tools", priority: 0.6 },
  { path: "contact", priority: 0.7 },
  { path: "contact/quick", priority: 0.5 },
  { path: "contact/smart", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.flatMap(({ path, priority }) => {
    const suffix = path ? `${path}/` : "";
    const languages = Object.fromEntries(
      locales.map((l) => [l, absoluteUrl(`/${l}/${suffix}`)]),
    );
    return locales.map((lang) => ({
      url: absoluteUrl(`/${lang}/${suffix}`),
      lastModified,
      priority,
      alternates: { languages },
    }));
  });
}
