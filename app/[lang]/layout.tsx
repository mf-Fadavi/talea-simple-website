import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "../globals.css";
import { locales, localeDirections, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PostHogAnalytics } from "@/components/integrations/posthog-analytics";
import { DifyChat } from "@/components/integrations/dify-chat";
import { JsonLd, organizationSchema } from "@/components/structured-data";
import { localeAlternates, siteName, siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.title,
      template: `%s — ${siteName}`,
    },
    description: dict.meta.description,
    alternates: localeAlternates(locale, ""),
    openGraph: {
      type: "website",
      siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      locale,
      images: [{ url: "/images/containers.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const dir = localeDirections[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${vazirmatn.variable} h-full`}
    >
      <body className="flex min-h-full flex-col text-ink antialiased">
        <JsonLd data={organizationSchema()} />
        <Header dict={dict} locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} locale={locale} />
        <PostHogAnalytics />
        <DifyChat />
      </body>
    </html>
  );
}
