"use client";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  Lightbulb,
  PackageCheck,
  Search,
  Ship,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";

const VH_PER_STEP = 18;

const STEP_ICONS: LucideIcon[] = [
  Lightbulb,
  ClipboardList,
  Search,
  FileSignature,
  ClipboardCheck,
  Ship,
  PackageCheck,
];

function StepIcon({ index, className }: { index: number; className?: string }) {
  const Icon = STEP_ICONS[index] ?? STEP_ICONS[0];
  return <Icon className={className} strokeWidth={1.8} aria-hidden="true" />;
}

function StepsTimeline({ dict, className }: { dict: Dictionary; className?: string }) {
  return (
    <div className={`grid content-start gap-2.5 ${className ?? ""}`}>
      <p className="text-xs font-bold tracking-widest text-brand uppercase">
        {dict.process.eyebrow}
      </p>
      <h2 className="text-4xl leading-none font-bold tracking-tight md:text-5xl">
        {dict.process.heading}
      </h2>
      <p className="text-base leading-relaxed text-gray-600 text-pretty">
        {dict.process.subtitleNarrow}
      </p>

      <ol className="mt-2 grid gap-1.5">
        {dict.process.steps.map((step, i) => (
          <li
            key={step.title}
            className="flex items-center gap-3 rounded-xl border border-gray-150 bg-white px-3 py-2"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-[11px] font-bold text-brand">
              {i + 1}
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-pretty">{step.title}</h3>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepsWheel({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const activeFloat = progress * (steps.length - 1);
      const activeIndex = Math.round(activeFloat);

      steps.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const offset = i - activeFloat;
        const abs = Math.abs(offset);
        const goingUp = offset < 0;
        const isActive = abs < 0.5;
        const near = Math.max(0, 1 - abs);

        const translateY = offset * 260;
        const translateZ = -Math.min(abs, 3) * 250;
        const rotateX = goingUp ? Math.min(46, abs * 38) : -Math.min(34, abs * 28);
        const scale = Math.max(0.62, 1.1 - abs * 0.24);
        const opacity = abs >= 1.9 ? 0 : Math.max(0, 1 - abs * 0.52);

        card.style.transform = `translateY(calc(-50% + ${translateY}px)) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(100 - abs * 10));
        card.style.pointerEvents = isActive ? "auto" : "none";
        card.style.borderColor = `rgba(179,38,36,${near.toFixed(2)})`;
        card.style.borderWidth = abs < 1 ? `${((1 - abs) * 2).toFixed(1)}px` : "0px";
        card.style.boxShadow =
          abs < 1
            ? `0 ${(18 + near * 26).toFixed(0)}px ${(48 + near * 52).toFixed(0)}px rgba(21,21,21,${(0.07 + near * 0.06).toFixed(3)}), 0 0 0 ${(near * 6).toFixed(1)}px rgba(179,38,36,${(near * 0.07).toFixed(3)})`
            : "0 18px 48px rgba(21,21,21,.06)";
      });

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const reached = i <= activeIndex;
        const isActive = i === activeIndex;
        dot.style.width = isActive ? "14px" : "8px";
        dot.style.height = isActive ? "14px" : "8px";
        dot.style.background = reached ? "var(--color-brand)" : "#D8D3CF";
      });

      if (fillRef.current) {
        fillRef.current.style.height = `${progress * 100}%`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [steps]);

  return (
    <div
      ref={trackRef}
      style={{ height: `calc(100vh + ${(steps.length - 1) * VH_PER_STEP}vh)` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-[min(100%-48px,1320px)] grid-cols-[minmax(240px,1fr)_auto_minmax(0,1.6fr)] items-center gap-[clamp(20px,2.5vw,40px)]">
          <div className="grid max-w-[400px] gap-3.5">
            <p className="text-xs font-bold tracking-widest text-brand uppercase">
              {dict.process.eyebrow}
            </p>
            <h2 className="text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none font-bold tracking-tight">
              {dict.process.heading}
            </h2>
            <p className="text-base leading-relaxed text-gray-600 text-pretty">
              {dict.process.subtitleWide}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="flex align-middle relative h-[min(58vh,430px)] w-px justify-self-center bg-gray-150"
          >
            <div ref={fillRef} className="absolute top-0 h-0 w-px bg-brand" />
            <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-between">
              {steps.map((step, i) => (
                <span
                  key={step.title}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="h-2 w-2 rounded-full bg-[#D8D3CF] shadow-[0_0_0_5px_#FFFFFF] transition-[width,height,background-color] duration-300 ease-out"
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[min(62vh,460px)] [perspective:1400px] [perspective-origin:50%_50%] [transform-style:preserve-3d]">
            {steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute start-[9%] top-1/2 end-[9%] grid gap-[18px] rounded-[20px] border bg-white/[.86] p-[clamp(26px,3vw,42px)] backdrop-blur-[18px] [transform-origin:50%_50%] will-change-[transform,opacity]"
              >
                <div className="grid h-[54px] w-[54px] place-items-center rounded-2xl border border-brand-border bg-brand-soft text-brand">
                  <StepIcon index={i} />
                </div>
                <h3 className="m-0 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1] font-bold tracking-tight text-balance">
                  {step.title}
                </h3>
                <p className="m-0 max-w-[52ch] text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed text-gray-600 text-pretty">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ProcessSteps({ dict }: { dict: Dictionary }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  return (
    <section id="process" className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {reducedMotion ? (
          <div className="grid gap-12 md:grid-cols-[minmax(240px,1fr)_2fr] md:gap-16">
            <StepsTimeline dict={dict} className="md:sticky md:top-28 md:self-start" />
          </div>
        ) : (
          <>
            <StepsTimeline dict={dict} className="md:hidden" />
            <div className="hidden md:block">
              <StepsWheel dict={dict} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
