// Service page slugs, in the same order as dict.services.scenarios and
// dict.servicePages — the two arrays are kept index-aligned.
export const serviceSlugs = [
  "product-sourcing",
  "procurement",
  "private-label",
  "quality-control",
  "warehousing",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}
