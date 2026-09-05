import type { Dictionary } from "@/lib/i18n/dictionaries";
import containers from "@/public/images/containers.png";
import symPeople from "@/public/images/sym-people.png";
import symTrust from "@/public/images/sym-trust.png";
import wChina from "@/public/images/w-china.png";
import wWorld from "@/public/images/w-world.png";
import Image from "next/image";

export function WhoWeAre({ dict }: { dict: Dictionary }) {
  return (
    <section id="who" className="border-y border-gray-150 bg-gray-50 py-20 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid max-w-2xl gap-3.5 md:mb-14">
          <p className="text-xs font-bold tracking-widest text-brand uppercase">
            {dict.who.eyebrow}
          </p>
          <h2 className="text-4xl leading-none font-bold tracking-tight md:text-5xl">
            {dict.who.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(255px,auto))]">
          <div className="relative flex flex-col justify-end gap-1.5 overflow-hidden rounded-2xl border border-brand bg-brand p-6 text-white transition-transform hover:-translate-y-1 md:col-start-1 md:row-start-1 md:p-8">
            <Image
              src={containers}
              alt=""
              className="pointer-events-none absolute top-[-30px] end-0 h-auto w-[150px] opacity-30 mix-blend-luminosity md:w-[190px]"
            />
            <span className="relative text-4xl leading-none font-extrabold tracking-tight md:text-5xl">
              {dict.who.statContainers.value}
            </span>
            <span className="relative text-sm font-semibold opacity-90">
              {dict.who.statContainers.label}
            </span>
          </div>

          <div className="relative flex flex-col justify-end gap-1.5 overflow-hidden rounded-2xl border border-[#F3DEDC] bg-gradient-to-b from-white to-[#FFF6F5] p-6 shadow-[0_10px_26px_rgba(179,38,36,0.07)] transition-transform hover:-translate-y-1 md:col-start-1 md:row-start-2 md:p-8">
            <Image
              src={symPeople}
              alt=""
              className="pointer-events-none absolute top-7 end-0 w-[85%] opacity-20"
            />
            <span className="relative text-4xl leading-none font-extrabold tracking-tight text-brand md:text-5xl">
              {dict.who.statPeople.value}
            </span>
            <span className="relative text-sm font-semibold text-ink">
              {dict.who.statPeople.label}
            </span>
          </div>

          <div className="relative col-span-2 flex flex-col justify-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF7F6] via-[#FDEDEB] to-[#F7E3E0] p-7 md:col-start-2 md:row-start-1 md:row-span-2 md:p-10">
            <Image
              src={wChina}
              alt=""
              className="pointer-events-none absolute end-[-12%] bottom-[-18%] w-[56%] opacity-15"
            />
            <div className="relative grid gap-4">
              <div className="h-[3px] w-[42px] rounded-full bg-brand" />
              <p className="text-lg leading-snug font-medium text-pretty md:text-2xl">
                {dict.who.midText}
              </p>
              <p className="text-sm leading-relaxed text-[#7A5F5C]">{dict.who.midSub}</p>
            </div>
          </div>

          <div className="relative flex flex-col justify-end gap-1.5 overflow-hidden rounded-2xl border border-[#F3DEDC] bg-gradient-to-b from-white to-[#FFF6F5] p-6 shadow-[0_10px_26px_rgba(179,38,36,0.07)] transition-transform hover:-translate-y-1 md:col-start-4 md:row-start-1 md:p-8">
            <Image
              src={symTrust}
              alt=""
              className="pointer-events-none absolute top-10 end-[-20%] h-auto w-85 opacity-20"
            />
            <span className="relative text-4xl leading-none font-extrabold tracking-tight text-brand md:text-5xl">
              {dict.who.statYears.value}
            </span>
            <span className="relative text-sm font-semibold text-ink">
              {dict.who.statYears.label}
            </span>
          </div>

          <div className="relative flex flex-col justify-end gap-1.5 overflow-hidden rounded-2xl bg-ink p-6 text-white transition-transform hover:-translate-y-1 md:p-8">
            <Image
              src={wWorld}
              alt=""
              className="pointer-events-none absolute inset-s-2 top-0 w-[130%] opacity-25"
            />
            <span className="relative text-4xl leading-none font-extrabold tracking-tight md:text-5xl">
              {dict.who.statCountries.value}
            </span>
            <span className="relative text-sm font-semibold opacity-90">
              {dict.who.statCountries.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
