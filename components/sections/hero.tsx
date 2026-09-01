import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowForwardIcon, ArrowDownIcon, CheckCircleIcon } from "@/components/icons";
import taleaMark from "@/public/images/talea-logo-icon.svg";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-gray-150 bg-gradient-to-b from-white to-gray-50 pt-12 pb-14 md:pt-16 md:pb-20"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div className="grid gap-6">
          <h1 className="text-5xl leading-[0.95] font-extrabold tracking-tight text-balance md:text-7xl">
            {dict.hero.titleLine1}
            <br />
            <span className="text-brand">{dict.hero.titleAccent}</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-gray-600 text-pretty">
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#cta"
              className="inline-flex min-h-13 items-center gap-2.5 rounded-xl bg-brand px-6 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
            >
              {dict.hero.primaryCta}
              <ArrowForwardIcon />
            </a>
            <a
              href="#process"
              className="inline-flex min-h-13 items-center gap-2 px-1 text-[15px] font-semibold text-ink transition-colors hover:text-brand"
            >
              {dict.hero.secondaryCta}
              <ArrowDownIcon />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-150 pt-5">
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-600">
              <CheckCircleIcon className="text-brand" />
              {dict.hero.badge1}
            </span>
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-600">
              <CheckCircleIcon className="text-brand" />
              {dict.hero.badge2}
            </span>
          </div>
        </div>
        <div className="flex min-h-[300px] items-center justify-center md:min-h-[420px]">
          <Image
            src={taleaMark}
            alt="Talea"
            width={520}
            height={520}
            className="w-full max-w-md"
            priority
          />
        </div>
      </div>
    </section>
  );
}
