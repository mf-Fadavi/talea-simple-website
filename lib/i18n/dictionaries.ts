import en from "./dictionaries/en.json";
import fa from "./dictionaries/fa.json";
import type { Locale } from "./config";

export type Dictionary = typeof en;

const dictionaries = { en, fa } satisfies Record<Locale, Dictionary>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
