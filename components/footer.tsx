import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { TaleaLogo } from "@/components/talea-logo";

const SOCIAL_ICONS = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" />
      <path d="m2 6 10 7 10-7" />
    </>
  ),
  wechat: (
    <>
      <path d="M9 3C5 3 2 5.7 2 9c0 1.9 1 3.6 2.6 4.7L4 17l3.2-1.7c.6.1 1.2.2 1.8.2" />
      <path d="M22 15c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3L21 21l-.5-2.4A4.8 4.8 0 0 0 22 15z" />
    </>
  ),
};

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const companyLinks = ["#who", "#process", `/${locale}/contact`];
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-ink pt-14 text-white md:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 md:grid-cols-4 md:pb-14">
          <div className="grid content-start gap-4">
            <TaleaLogo variant="text" height={36} className="brightness-0 invert" />
            <p className="max-w-[30ch] text-sm leading-relaxed text-gray-400">
              {dict.footer.tagline}
            </p>
          </div>

          <div className="grid content-start gap-3">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {dict.footer.servicesHeading}
            </span>
            {dict.footer.services.map((label) => (
              <a
                key={label}
                href="#services"
                className="text-sm text-gray-200 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="grid content-start gap-3">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {dict.footer.companyHeading}
            </span>
            {dict.footer.company.map((label, i) =>
              companyLinks[i].startsWith("/") ? (
                <Link
                  key={label}
                  href={companyLinks[i]}
                  className="text-sm text-gray-200 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={companyLinks[i]}
                  className="text-sm text-gray-200 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ),
            )}
          </div>

          <div className="grid content-start gap-3">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {dict.footer.contactHeading}
            </span>
            <a
              href="mailto:hello@talea.com"
              dir="ltr"
              className="text-start text-sm text-gray-200 transition-colors hover:text-white"
            >
              hello@talea.com
            </a>
            <a
              href="tel:+862112345678"
              dir="ltr"
              className="text-start text-sm text-gray-200 transition-colors hover:text-white"
            >
              +86 21 1234 5678
            </a>
            <span className="text-sm text-gray-400">{dict.footer.location}</span>
            <div className="mt-2 flex gap-2.5">
              {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).map((key) => (
                <a
                  key={key}
                  href={key === "email" ? "mailto:hello@talea.com" : "#contact"}
                  aria-label={key}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-gray-700 text-gray-200 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {SOCIAL_ICONS[key]}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-700 py-6">
          <span className="text-[13px] text-gray-500">
            {dict.footer.copyright.replace("{year}", locale === "fa" ? toFaDigits(year) : String(year))}
          </span>
          <div className="flex gap-6">
            <a href="#contact" className="text-[13px] text-gray-500 transition-colors hover:text-gray-200">
              {dict.footer.privacy}
            </a>
            <a href="#contact" className="text-[13px] text-gray-500 transition-colors hover:text-gray-200">
              {dict.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function toFaDigits(value: number): string {
  const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}
