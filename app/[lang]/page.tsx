import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { Hero } from "@/components/sections/hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { WhoWeAre } from "@/components/sections/who-we-are";
import { Testimonial } from "@/components/sections/testimonial";
import { Services } from "@/components/sections/services";
import { Cta } from "@/components/sections/cta";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Hero dict={dict} locale={lang as Locale} />
      <ProcessSteps dict={dict} />
      <WhoWeAre dict={dict} />
      <Testimonial dict={dict} />
      <Services dict={dict} locale={lang as Locale} />
      <Cta dict={dict} locale={lang as Locale} />
    </>
  );
}
