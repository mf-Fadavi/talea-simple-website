export const locales = ["en", "fa", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  de: "Deutsch",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
  de: "ltr",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
