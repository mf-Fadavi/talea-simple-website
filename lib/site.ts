import { locales, type Locale } from "@/lib/i18n/config";

// Public origin of the deployed site. When a custom domain is configured
// (NEXT_PUBLIC_SITE_URL), the site is served from the domain root; otherwise
// it lives under the GitHub Pages project path.
const GITHUB_PAGES_URL = "https://mf-fadavi.github.io/talea-simple-website";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || GITHUB_PAGES_URL
).replace(/\/$/, "");

export const siteName = "Talea";

/** Absolute URL for a path like "/en/faq/" (trailing slash preserved). */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

/**
 * Canonical + hreflang alternates for a locale-relative path ("" for the
 * home page, "faq" for /{lang}/faq/, ...). x-default points at English.
 */
export function localeAlternates(lang: Locale, path: string) {
  const suffix = path ? `${path}/` : "";
  const languages = Object.fromEntries(
    locales.map((l) => [l, absoluteUrl(`/${l}/${suffix}`)]),
  ) as Record<string, string>;
  languages["x-default"] = absoluteUrl(`/en/${suffix}`);
  return {
    canonical: absoluteUrl(`/${lang}/${suffix}`),
    languages,
  };
}
