// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Link } from "@/i18n/navigation";

export function HomeHero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative flex items-center justify-center px-4 py-16 md:py-28">
      {/* ESAP gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-esap-yellow/5 via-esap-pink/5 to-esap-blue/5" />

      <AnimatedSection className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 italic">
          {t("subtitle")}
        </p>
        <Link
          href="/stories"
          className="inline-block px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {t("cta")}
        </Link>
      </AnimatedSection>
    </section>
  );
}
