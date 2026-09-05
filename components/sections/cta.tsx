import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ArrowForwardIcon } from "@/components/icons";
import wTrain from "@/public/images/w-train.png";
import wShip from "@/public/images/w-ship.png";

export function Cta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-brand py-16 text-white md:py-32"
    >
      <Image
        src={wTrain}
        alt=""
        className="pointer-events-none absolute start-[-8%] top-[-5%] w-[70%] opacity-20 grayscale brightness-200 md:w-[46%]"
      />
      <Image
        src={wShip}
        alt=""
        className="pointer-events-none absolute end-[-5%] top-[-1%] hidden w-[44%] opacity-15 grayscale brightness-200 md:block"
      />
      <div className="relative mx-auto grid max-w-3xl justify-items-center gap-6 px-6 text-center">
        <p className="text-xs font-bold tracking-widest opacity-80 uppercase">
          {dict.cta.eyebrow}
        </p>
        <h2 className="text-4xl leading-[0.98] font-extrabold tracking-tight text-balance md:text-6xl">
          {dict.cta.heading}
        </h2>
        <p className="max-w-[52ch] text-lg leading-relaxed opacity-90 text-pretty">
          {dict.cta.subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-14 items-center gap-2.5 rounded-xl bg-white px-7 text-base font-semibold text-brand transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
          >
            {dict.cta.button}
            <ArrowForwardIcon />
          </Link>
          <span className="text-[15px] opacity-85">{dict.cta.note}</span>
        </div>
      </div>
    </section>
  );
}
