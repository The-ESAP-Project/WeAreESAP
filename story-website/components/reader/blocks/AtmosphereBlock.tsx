// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { VisualEnhancement } from "@/types/interactive";

// 只注入子组件实际引用的两个 CSS 变量（text-foreground/text-muted-foreground）
// 背景色和边框由 globals.css 的 .mood-* class 处理
const DARK_MOOD_VARS: Record<string, Record<string, string>> = {
  dark: {
    "--foreground": "#ededed",
    "--muted-foreground": "#a3a3a3",
  },
  tense: {
    "--foreground": "#ededed",
    "--muted-foreground": "#a3a3a3",
  },
  dramatic: {
    "--foreground": "#ffffff",
    "--muted-foreground": "#b0b0b0",
  },
  eerie: {
    "--foreground": "#c0c0d0",
    "--muted-foreground": "#8888a0",
  },
};

interface AtmosphereBlockProps {
  visual: VisualEnhancement;
  children: React.ReactNode;
}

export const AtmosphereBlock = memo(function AtmosphereBlock({
  visual,
  children,
}: AtmosphereBlockProps) {
  const shouldReduceMotion = useReducedMotion();
  const { preferences } = useReadingPreferences();
  const disableAtmosphere = !preferences.atmosphereEffects;

  if (disableAtmosphere) {
    return <div className="my-4">{children}</div>;
  }

  const initial = shouldReduceMotion
    ? { opacity: 1 }
    : visual.animation === "fade-in"
      ? { opacity: 0 }
      : visual.animation === "slide-up"
        ? { opacity: 0, y: 20 }
        : { opacity: 1 };

  const isDarkMood = visual.mood != null && visual.mood in DARK_MOOD_VARS;
  const moodVars = visual.mood ? DARK_MOOD_VARS[visual.mood] : undefined;

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
      className={cn(
        "relative my-6 rounded-xl overflow-hidden",
        visual.mood && `mood-${visual.mood}`,
        visual.fullScreen && "min-h-[60vh] flex items-center"
      )}
      style={
        {
          ...moodVars,
          color: visual.textColor,
          backgroundImage: visual.backgroundImage
            ? `url(${visual.backgroundImage})`
            : undefined,
          backgroundSize: visual.backgroundImage ? "cover" : undefined,
          backgroundPosition: visual.backgroundImage ? "center" : undefined,
          textAlign: visual.textAlign,
        } as React.CSSProperties
      }
    >
      {visual.backgroundOverlay && (
        <div
          className="absolute inset-0"
          style={{ background: visual.backgroundOverlay }}
        />
      )}
      <div className="relative z-10 p-6 md:p-10 w-full">
        {isDarkMood && (
          <div
            className="text-xs font-mono text-muted-foreground mb-3 select-none pointer-events-none opacity-50"
            aria-hidden="true"
          >
            &gt;_
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
});
