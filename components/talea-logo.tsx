"use client";

import type { CSSProperties } from "react";
import { Lottie } from "lottie-react";
import textAnimation from "@/public/talea-logo-text-lotti.json";
import iconAnimation from "@/public/logo-icon-lottie.json";

type TaleaLogoVariant = "text" | "icon";

const ASPECT_RATIO: Record<TaleaLogoVariant, number> = {
  text: 1584 / 672,
  icon: 1007 / 480,
};

export function TaleaLogo({
  variant,
  height = 36,
  className,
  style,
}: {
  variant: TaleaLogoVariant;
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Lottie
      src={variant === "text" ? textAnimation : iconAnimation}
      loop={false}
      autoplay
      className={className}
      style={{ height, width: height * ASPECT_RATIO[variant], ...style }}
    />
  );
}
