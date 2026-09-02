"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { TaleaLogo } from "@/components/talea-logo";

const SCROLL_THRESHOLD = 24;

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "#services", label: dict.nav.services },
    { href: "#who", label: dict.nav.who },
    { href: "#process", label: dict.nav.process },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href={`/${locale}#top`}
          aria-label="Talea"
          className="relative block h-9 w-[85px] shrink-0"
        >
          <TaleaLogo
            variant="text"
            height={36}
            style={{ position: "absolute", top: 0, insetInlineStart: 0 }}
            className={`transition-opacity duration-300 ${
              scrolled ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          />
          <TaleaLogo
            variant="icon"
            height={36}
            style={{ position: "absolute", top: 0, insetInlineStart: 0 }}
            className={`transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <a
            href="#cta"
            className="hidden min-h-12 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover md:inline-flex"
          >
            {dict.common.startSourcing}
          </a>
          <button
            type="button"
            aria-label={dict.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-12 w-12 place-items-center rounded-xl border border-black/10 text-ink md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white px-6 py-4 md:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-gray-150 py-3.5 text-base font-semibold text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-gray-150 py-3.5 text-base font-semibold text-ink"
                >
                  {item.label}
                </a>
              ),
            )}
            <a
              href="#cta"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white"
            >
              {dict.common.startSourcing}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
