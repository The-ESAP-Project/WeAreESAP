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

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ContentBlockRenderer } from "@/components/content/ContentBlocks";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Sponsor } from "@/types/sponsor";

interface SponsorTabProps {
  sponsor: Sponsor;
}

export function SponsorTab({ sponsor }: SponsorTabProps) {
  const t = useTranslations("about.sponsor");

  const gradientH = useMemo(
    () =>
      sponsor.theme
        ? {
            background: `linear-gradient(90deg, ${sponsor.theme.primary}, ${sponsor.theme.accent})`,
          }
        : undefined,
    [sponsor.theme]
  );

  const gradientV = useMemo(
    () =>
      sponsor.theme
        ? {
            background: `linear-gradient(180deg, ${sponsor.theme.primary}, ${sponsor.theme.accent})`,
          }
        : undefined,
    [sponsor.theme]
  );

  const hasHero = Boolean(sponsor.heroImage);
  const hasImages = Boolean(sponsor.images?.length);
  const hasSections = Boolean(sponsor.sections?.length);

  let nextDelay = 0;
  const heroDelay = nextDelay;
  if (hasHero) nextDelay += 0.1;
  const infoDelay = nextDelay;
  nextDelay += 0.1;
  const galleryDelay = nextDelay;
  if (hasImages) nextDelay += 0.1;
  const sectionBaseDelay = nextDelay;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero 卡片 */}
      {hasHero && (
        <AnimatedSection delay={heroDelay}>
          <div className="relative rounded-xl overflow-hidden border border-border">
            <div className="relative aspect-[5/2]">
              <Image
                src={sponsor.heroImage!}
                alt={sponsor.name}
                fill
                className="object-cover select-none pointer-events-none [-webkit-touch-callout:none]"
                sizes="(max-width: 640px) 100vw, 896px"
                draggable={false}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: sponsor.theme
                    ? `linear-gradient(to top, ${sponsor.theme.primary}ee 0%, ${sponsor.theme.primary}80 30%, transparent 70%)`
                    : "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.5) 30%, transparent 70%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
                {sponsor.logo && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-black/30 backdrop-blur-sm shrink-0">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-1.5 select-none pointer-events-none [-webkit-touch-callout:none]"
                      sizes="56px"
                      draggable={false}
                    />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  {sponsor.name}
                </h2>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 信息卡片 */}
      <AnimatedSection delay={infoDelay}>
        <div className="relative p-5 rounded-xl border border-border bg-muted/30 overflow-hidden space-y-4">
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-0.5",
              !sponsor.theme &&
                "bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
            )}
            style={gradientH}
          />

          {!hasHero && (
            <div className="flex items-center gap-4">
              {sponsor.logo && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-muted/30 shrink-0">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain p-1.5 select-none pointer-events-none [-webkit-touch-callout:none]"
                    sizes="48px"
                    draggable={false}
                  />
                </div>
              )}
              <h2 className="text-3xl font-bold text-foreground">
                {sponsor.name}
              </h2>
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">
            {sponsor.description}
          </p>

          <div className="flex items-center gap-4 pt-1">
            <div
              className={cn(
                "w-24 h-1 rounded-full",
                !sponsor.theme &&
                  "bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
              )}
              style={gradientH}
            />
            {sponsor.url && (
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 hover:border-esap-blue/40 transition-all text-foreground font-medium text-sm"
              >
                <Icon name="ExternalLink" size={14} />
                {t("visitWebsite")}
              </a>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* 图片展示 */}
      {hasImages && (
        <AnimatedSection delay={galleryDelay}>
          <div
            className={cn(
              "grid gap-4",
              sponsor.images!.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            {sponsor.images!.map((src, index) => (
              <div
                key={src}
                className={cn(
                  "relative aspect-video rounded-xl overflow-hidden border border-border group",
                  index === 0 && sponsor.images!.length > 2 && "sm:col-span-2"
                )}
              >
                <Image
                  src={src}
                  alt={`${sponsor.name} - ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02] select-none pointer-events-none [-webkit-touch-callout:none]"
                  draggable={false}
                  sizes={
                    index === 0 && sponsor.images!.length > 2
                      ? "(max-width: 640px) 100vw, 896px"
                      : "(max-width: 640px) 100vw, 448px"
                  }
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* 内容区段 */}
      {hasSections &&
        sponsor.sections!.map((section, index) => (
          <AnimatedSection
            key={section.id}
            delay={sectionBaseDelay + index * 0.1}
          >
            <div className="p-5 rounded-xl border border-border bg-muted/30">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span
                  className={cn(
                    "w-1 h-6 rounded-full",
                    !sponsor.theme &&
                      "bg-linear-to-b from-esap-yellow via-esap-pink to-esap-blue"
                  )}
                  style={gradientV}
                />
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.content.map((block, i) => (
                  <ContentBlockRenderer
                    key={`${block.type}-${i}`}
                    block={block}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
    </div>
  );
}
