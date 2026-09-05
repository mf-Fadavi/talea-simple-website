export const locales = ["en", "de", "fa"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fa: "فارسی",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  de: "ltr",
  fa: "rtl",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
