"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { GlobeIcon, ChevronDownIcon, CheckCircleIcon } from "@/components/icons";

const localePrefixPattern = new RegExp(`^/(${locales.join("|")})`);

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "/";
  const rest = pathname.replace(localePrefixPattern, "");

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors ${
          open
            ? "border-brand-border bg-brand-soft text-brand"
            : "border-black/10 text-ink hover:bg-black/5"
        }`}
      >
        <GlobeIcon className={open ? "text-brand" : "text-ink/70"} />
        <span className="uppercase">{locale}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-[170px] overflow-hidden rounded-xl border border-black/10 bg-white py-1.5 shadow-xl shadow-black/10"
        >
          {locales.map((candidate) => {
            const active = candidate === locale;
            return (
              <Link
                key={candidate}
                href={`/${candidate}${rest}`}
                role="option"
                aria-selected={active}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${candidate};path=/;max-age=31536000`;
                  setOpen(false);
                }}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                  active ? "bg-brand-soft font-semibold text-brand" : "text-ink hover:bg-black/5"
                }`}
              >
                {localeNames[candidate]}
                {active && <CheckCircleIcon className="h-4 w-4 shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
