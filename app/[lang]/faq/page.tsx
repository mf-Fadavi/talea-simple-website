import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/site";
import { JsonLd, faqSchema } from "@/components/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: { absolute: dict.faq.metaTitle },
    description: dict.faq.metaDescription,
    alternates: localeAlternates(lang as Locale, "faq"),
  };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd data={faqSchema(dict.faq.items)} />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-brand transition-colors hover:text-brand-hover"
        >
          ← {dict.faq.back}
        </Link>
        <p className="mt-8 text-xs font-bold tracking-widest text-brand uppercase">
          {dict.faq.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl">
          {dict.faq.heading}
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-gray-600 text-pretty">
          {dict.faq.subtitle}
        </p>

        <div className="mt-12 grid gap-10">
          {dict.faq.items.map((item) => (
            <div key={item.q}>
              <h2 className="text-xl font-bold tracking-tight">{item.q}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-brand p-8 text-white">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {dict.cta.heading}
          </h2>
          <p className="mt-2 leading-relaxed opacity-90">{dict.cta.subtitle}</p>
          <Link
            href={`/${locale}/contact`}
            className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-semibold text-brand transition-transform hover:-translate-y-0.5"
          >
            {dict.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
