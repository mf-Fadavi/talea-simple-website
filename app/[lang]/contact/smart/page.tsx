import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { SmartLeadForm } from "@/components/forms/smart-lead-form";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact/smart">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.smartForm.step0.heading,
    description: dict.smartForm.step1.intro,
    alternates: localeAlternates(lang as Locale, "contact/smart"),
  };
}

export default async function SmartRequestPage({ params }: PageProps<"/[lang]/contact/smart">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <SmartLeadForm dict={dict.smartForm} locale={locale} />;
}
