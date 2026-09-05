import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { QuickContactForm } from "@/components/forms/quick-contact-form";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact/quick">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: `${dict.quickForm.headingPrefix} ${dict.quickForm.headingAccent}`,
    description: dict.quickForm.intro,
    alternates: localeAlternates(lang as Locale, "contact/quick"),
  };
}

export default async function QuickContactPage({ params }: PageProps<"/[lang]/contact/quick">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <QuickContactForm dict={dict.quickForm} locale={locale} />;
}
