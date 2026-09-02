import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ArrowForwardIcon } from "@/components/icons";

const ROUTES = ["quick", "smart"] as const;

export default async function ContactHubPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const { contactHub } = dict;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <Link
        href={`/${locale}#top`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-brand"
      >
        <ArrowForwardIcon className="rotate-180" />
        {contactHub.back}
      </Link>

      <p className="text-xs font-bold tracking-widest text-brand uppercase">{contactHub.eyebrow}</p>
      <h1 className="mt-2 text-4xl leading-[0.98] font-extrabold tracking-tight text-balance md:text-6xl">
        {contactHub.heading}
      </h1>
      <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-gray-600 text-pretty">
        {contactHub.subtitle}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {contactHub.options.map((option, index) => (
          <Link
            key={option.title}
            href={`/${locale}/contact/${ROUTES[index]}`}
            className="group flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-border hover:shadow-xl hover:shadow-black/5"
          >
            <span className="text-xs font-bold tracking-widest text-brand uppercase">{option.meta}</span>
            <h2 className="text-2xl font-bold tracking-tight">{option.title}</h2>
            <p className="text-sm leading-relaxed text-gray-600">{option.description}</p>
            <span className="mt-auto inline-flex items-center gap-2.5 pt-3 text-sm font-semibold text-brand">
              {option.cta}
              <ArrowForwardIcon className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
