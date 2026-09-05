import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/site";
import { serviceSlugs, isServiceSlug } from "@/lib/services";
import { JsonLd, faqSchema, serviceSchema } from "@/components/structured-data";
import { CheckCircleIcon } from "@/components/icons";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const dict = await getDictionary(lang as Locale);
  const page = dict.servicePages.items[serviceSlugs.indexOf(slug)];
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: localeAlternates(lang as Locale, `services/${slug}`),
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const index = serviceSlugs.indexOf(slug);
  const page = dict.servicePages.items[index];
  const scenario = dict.services.scenarios[index];

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: page.metaTitle,
          description: page.metaDescription,
          path: `/${locale}/services/${slug}/`,
        })}
      />
      <JsonLd data={faqSchema(page.faqs)} />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-brand transition-colors hover:text-brand-hover"
        >
          ← {dict.servicePages.back}
        </Link>
        <p className="mt-8 text-xs font-bold tracking-widest text-brand uppercase">
          {scenario.label}
        </p>
        <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-700 text-pretty">
          {page.lead}
        </p>

        <div className="mt-10 rounded-2xl border border-black/10 p-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase">
            {dict.servicePages.includedHeading}
          </h2>
          <ul className="mt-4 grid gap-3">
            {scenario.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 text-brand">
                  <CheckCircleIcon />
                </span>
                <span className="leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-10">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold tracking-tight">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-bold tracking-tight">
          {dict.servicePages.faqHeading}
        </h2>
        <div className="mt-6 grid gap-8">
          {page.faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-lg font-bold tracking-tight">{faq.q}</h3>
              <p className="mt-2 leading-relaxed text-gray-700">{faq.a}</p>
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
            {scenario.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
