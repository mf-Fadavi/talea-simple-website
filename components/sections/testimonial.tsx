import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { QuoteIcon } from "@/components/icons";
import wWorld from "@/public/images/w-world.png";

export function Testimonial({ dict }: { dict: Dictionary }) {
  const initials = dict.testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="relative overflow-hidden border-b border-gray-150 bg-[#FFF6F5] py-16 md:py-28">
      <Image
        src={wWorld}
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-15"
      />
      <div className="relative mx-auto grid max-w-4xl gap-5 px-6">
        <QuoteIcon className="text-brand opacity-90" />
        <p className="max-w-[34ch] text-2xl leading-snug font-medium text-pretty md:text-3xl">
          {dict.testimonial.quote}
        </p>
        <div className="flex items-center gap-3.5">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[#E7A3A1] text-sm font-bold text-[#8E1B19]">
            {initials}
          </div>
          <div className="grid">
            <span className="text-[15px] font-semibold">{dict.testimonial.name}</span>
            <span className="text-sm text-gray-500">{dict.testimonial.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
