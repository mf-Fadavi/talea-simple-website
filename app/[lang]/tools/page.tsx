import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ArrowForwardIcon } from "@/components/icons";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/tools">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.tools.heading,
    description: dict.tools.subtitle,
    alternates: localeAlternates(lang as Locale, "tools"),
  };
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  cbm: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M12 12v9" />
      <path d="M4 7.5 12 12l8-4.5" />
    </>
  ),
  rfq: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
    </>
  ),
  cost: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.6c0-1.4-1.3-2.4-3-2.4s-3 1-3 2.3c0 1.3 1.2 1.8 3 2.2 1.8.4 3 .9 3 2.3 0 1.3-1.3 2.4-3 2.4s-3-1-3-2.4" />
    </>
  ),
  verify: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  hs: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h5l9 9a2 2 0 0 1 0 2.8l-4.2 4.2a2 2 0 0 1-2.8 0L3 12V7Z" />
      <circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
};

export default async function ToolsPage({ params }: PageProps<"/[lang]/tools">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const { tools } = dict;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <Link
        href={`/${locale}#top`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-brand"
      >
        <ArrowForwardIcon className="rotate-180" />
        {tools.back}
      </Link>

      <p className="text-xs font-bold tracking-widest text-brand uppercase">{tools.eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-4xl leading-[0.98] font-extrabold tracking-tight text-balance md:text-6xl">
        {tools.heading}
      </h1>
      <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-gray-600 text-pretty">
        {tools.subtitle}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.items.map((item) => (
          <div
            key={item.title}
            className="group relative flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-border hover:shadow-xl hover:shadow-black/5"
          >
            <span className="absolute top-6 end-6 rounded-full bg-gray-150 px-2.5 py-1 text-[11px] font-bold tracking-wide text-gray-600 uppercase">
              {tools.badge}
            </span>

            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {TOOL_ICONS[item.icon]}
              </svg>
            </span>

            <h2 className="pe-16 text-xl font-bold tracking-tight">{item.title}</h2>
            <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>

            <span className="mt-auto inline-flex items-center gap-2.5 pt-3 text-sm font-semibold text-gray-400">
              {tools.cta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
