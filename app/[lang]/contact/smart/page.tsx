import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { SmartLeadForm } from "@/components/forms/smart-lead-form";

export default async function SmartRequestPage({ params }: PageProps<"/[lang]/contact/smart">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <SmartLeadForm dict={dict.smartForm} locale={locale} />;
}
