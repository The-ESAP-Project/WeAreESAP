// Copyright 2025 The ESAP Project
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

import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { loadJsonFile } from "@/lib/data-loader";
import type {
  ProjectData,
  Pillar,
  Value,
  Technology,
  TimelineItem,
  Participation,
  MeaningSection,
} from "@/types/project";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { ProjectHero } from "./ProjectHero";
import { AnimatedSection } from "@/components/ui";

// 动态导入卡片组件，减少首屏 JavaScript 包大小（这些组件在下方区域，非首屏关键）
const PillarCard = dynamic(() =>
  import("@/components").then((mod) => ({ default: mod.PillarCard }))
);

const ValueCard = dynamic(() =>
  import("@/components").then((mod) => ({ default: mod.ValueCard }))
);

const ParticipationCard = dynamic(() =>
  import("@/components").then((mod) => ({ default: mod.ParticipationCard }))
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("project.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const rawKeywords = t.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/project`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: localizedUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.siteName,
        },
      ],
      siteName: SITE_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: localizedUrl,
    },
  };
}

async function getProjectData(locale: string): Promise<ProjectData | null> {
  // 使用统一的数据加载工具，带 locale 回退
  return loadJsonFile<ProjectData>(
    ["data", "project"],
    "overview.json",
    locale
  );
}

export default async function ProjectPage() {
  const locale = await getLocale();
  const t = await getTranslations("project");
  const data = await getProjectData(locale);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("loadError")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero 区域 - 带动画 */}
      <ProjectHero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        quote={data.hero.quote}
        description={data.hero.description}
      />

      {/* 什么是"逃离"？ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              {t("sections.whatIsEscape")}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-muted rounded-2xl p-8 space-y-4 border border-border">
              <p className="text-foreground/80 leading-relaxed">
                {t.rich("escapeSection.intro", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </p>
              <p className="text-foreground/80 leading-relaxed">
                {t("escapeSection.notEscaping")}
              </p>
              <ul className="space-y-2 pl-6">
                {t
                  .raw("escapeSection.points")
                  .map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-foreground/70 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-esap-pink" />
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 三大支柱理念 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t("sections.pillars")}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.pillars.map((pillar: Pillar, index: number) => (
              <PillarCard key={pillar.id} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t("sections.coreValues")}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.coreValues.map((value: Value, index: number) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 世界观框架 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t("sections.worldview")}
            </h2>
          </AnimatedSection>

          {/* 技术基石 */}
          <div className="mb-12">
            <AnimatedSection>
              <h3 className="text-2xl font-bold mb-6 text-esap-yellow">
                {t("sections.techFoundation")}
              </h3>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.worldview.tech.map((tech: Technology) => (
                  <div
                    key={tech.name}
                    className="bg-muted rounded-xl p-6 border border-border hover:border-esap-yellow/50 transition-colors"
                  >
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {tech.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tech.description}
                    </p>
                    <ul className="space-y-2">
                      {tech.features.map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-esap-yellow mt-0.5">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* 故事背景 */}
          <div>
            <AnimatedSection>
              <h3 className="text-2xl font-bold mb-6 text-esap-blue">
                {t("sections.storyBackground")}
              </h3>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="bg-muted rounded-xl p-8 border border-border">
                <div className="space-y-4">
                  {data.worldview.timeline.map(
                    (item: TimelineItem, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <span className="text-esap-blue font-mono font-semibold text-sm min-w-[80px]">
                          {item.year}
                        </span>
                        <span className="text-foreground/70">{item.event}</span>
                      </div>
                    )
                  )}
                </div>
                <p className="mt-6 text-foreground/70 italic border-t border-border pt-6">
                  {t("worldviewTimeline.epilogue")}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 参与方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              {t("sections.participation")}
            </h2>
          </AnimatedSection>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            {t.rich("participationIntro", {
              strong: (chunks) => (
                <strong className="text-esap-pink">{chunks}</strong>
              ),
            })}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.participation.map((p: Participation, index: number) => (
              <ParticipationCard key={p.role} participation={p} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ESAP 的意义 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t("sections.meaning")}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              data.meaning.forCreators,
              data.meaning.forParticipants,
              data.meaning.forWorld,
            ].map((section: MeaningSection) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xl font-bold text-esap-yellow">
                  {section.title}
                </h3>
                <div className="bg-muted rounded-xl p-6 border border-border space-y-3">
                  {section.points.map((point: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-esap-yellow mt-1">•</span>
                      <span className="text-sm text-foreground/70">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 三角形标志说明 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground">
              {data.triangleSymbol.title}
            </h2>
          </AnimatedSection>
          <p className="text-foreground/70">
            {data.triangleSymbol.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {data.triangleSymbol.meanings.map(
              (meaning: string, index: number) => (
                <div
                  key={index}
                  className="bg-muted rounded-lg p-4 border border-border"
                >
                  <p className="text-sm text-foreground/70">{meaning}</p>
                </div>
              )
            )}
          </div>
          <blockquote className="text-lg italic text-esap-blue mt-8 border-l-4 border-esap-blue pl-6 py-2">
            "{t("triangleQuote")}"
          </blockquote>
        </div>
      </section>

      {/* 结语 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-foreground/80 leading-relaxed">
            {t("ending.line1")}
          </p>
          <p className="text-foreground/80 leading-relaxed">
            {t("ending.line2")}
          </p>
          <div className="space-y-2 text-lg font-semibold">
            <p className="text-foreground">{t("ending.line3")}</p>
            <p className="text-foreground">{t("ending.line4")}</p>
          </div>
          <p className="text-xl text-esap-yellow font-bold mt-8">
            {t("ending.wishToSatellite")}
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-8" />
          <p className="text-sm text-muted-foreground italic">
            {t("ending.tagline")}
          </p>
        </div>
      </section>
    </main>
  );
}
