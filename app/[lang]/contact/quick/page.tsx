import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { QuickContactForm } from "@/components/forms/quick-contact-form";

export default async function QuickContactPage({ params }: PageProps<"/[lang]/contact/quick">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <QuickContactForm dict={dict.quickForm} locale={locale} />;
}
