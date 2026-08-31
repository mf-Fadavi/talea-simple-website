"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowForwardIcon, CheckCircleIcon } from "@/components/icons";

export function Services({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const scenario = dict.services.scenarios[active];

  return (
    <section id="services" className="py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-7 grid max-w-2xl gap-3.5 md:mb-11">
          <p className="text-xs font-bold tracking-widest text-brand uppercase">
            {dict.services.eyebrow}
          </p>
          <h2 className="text-4xl leading-none font-bold tracking-tight md:text-5xl">
            {dict.services.heading}
          </h2>
          <p className="text-base text-gray-600">{dict.services.subtitle}</p>
        </div>

        <div className="grid gap-6 rounded-[22px] border border-black/[0.07] bg-white/80 p-4 shadow-[0_24px_60px_rgba(21,21,21,0.10)] backdrop-blur md:grid-cols-[1fr_1px_2fr] md:gap-8 md:p-8">
          <div role="tablist" aria-orientation="vertical" className="grid gap-1 content-start">
            {dict.services.scenarios.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-xl px-4 py-3 text-start text-[15px] font-semibold transition-colors ${
                    isActive ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"
                  }`}
                >
                  {s.label}
                  <ArrowForwardIcon className={isActive ? "opacity-100" : "opacity-20"} />
                </button>
              );
            })}
          </div>

          <div aria-hidden="true" className="hidden self-center bg-black/10 md:block md:h-1/2" />

          <div className="grid content-start gap-4 px-1 py-1 md:px-3">
            <div className="h-[3px] w-[42px] rounded-full bg-brand" />
            <h3 className="text-2xl leading-tight font-semibold tracking-tight text-balance md:text-[2rem]">
              {scenario.headline}
            </h3>
            <p className="max-w-[58ch] text-base leading-relaxed text-gray-600 text-pretty">
              {scenario.body}
            </p>
            <ul className="grid gap-2.5">
              {scenario.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[15px]">
                  <CheckCircleIcon className="mt-0.5 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className="mt-1 inline-flex min-h-12 w-fit items-center gap-2.5 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {scenario.cta}
              <ArrowForwardIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
