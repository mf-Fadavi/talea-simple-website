"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

const localePrefixPattern = new RegExp(`^/(${locales.join("|")})`);

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const rest = pathname.replace(localePrefixPattern, "");

  return (
    <div className="flex items-center gap-1 rounded-xl border border-black/10 p-1 text-xs font-semibold">
      {locales.map((candidate) => {
        const active = candidate === locale;
        return (
          <Link
            key={candidate}
            href={`/${candidate}${rest}`}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${candidate};path=/;max-age=31536000`;
            }}
            className={`rounded-lg px-2.5 py-1.5 transition-colors ${
              active ? "bg-ink text-white" : "text-ink/70 hover:bg-black/5"
            }`}
          >
            {localeNames[candidate]}
          </Link>
        );
      })}
    </div>
  );
}
