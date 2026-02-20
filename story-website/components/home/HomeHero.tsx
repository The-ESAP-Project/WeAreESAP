// Copyright 2021-2026 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
