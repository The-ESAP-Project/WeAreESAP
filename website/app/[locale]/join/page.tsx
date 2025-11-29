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
import { ChecklistItem } from "@/components";
import { Icon, type IconName, AnimatedSection } from "@/components/ui";
import { JoinHero } from "./JoinHero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type {
  RoleType,
  ParticipationMethod,
  Step,
  Principle,
  CommunityValue,
  Contribution,
} from "@/types/join";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";

// 懒加载非首屏组件（减少首屏 JavaScript 包大小）
const RoleTypeCard = dynamic(() =>
  import("@/components").then((mod) => ({ default: mod.RoleTypeCard }))
);

const StepCard = dynamic(() =>
  import("@/components").then((mod) => ({ default: mod.StepCard }))
);

const FAQAccordion = dynamic(
  () => import("@/components").then((mod) => ({ default: mod.FAQAccordion })),
  { loading: () => <div className="h-96 animate-pulse bg-muted rounded-xl" /> }
);

const ContactPlaceholder = dynamic(
  () =>
    import("@/components").then((mod) => ({ default: mod.ContactPlaceholder })),
  { loading: () => <div className="h-48 animate-pulse bg-muted rounded-xl" /> }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("join.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const rawKeywords = t.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/join`;

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

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("join");

  const roleTypes = t.raw("roleTypes");
  const welcomePositive = t.raw("welcome.positive");
  const welcomeNegative = t.raw("welcome.negative");
  const participationMethods = t.raw("participationMethods");
  const characterCreationSteps = t.raw("characterCreationSteps");
  const guidelinesPrinciples = t.raw("guidelines.principles");
  const technicalDos = t.raw("guidelines.technical.dos");
  const technicalDonts = t.raw("guidelines.technical.donts");
  const characterRecommended = t.raw("guidelines.character.recommended");
  const characterAvoid = t.raw("guidelines.character.avoid");
  const communityValues = t.raw("communityValues");
  const contributions = t.raw("contributions");
  const faqItems = t.raw("faq");
  const nextSteps = t.raw("nextSteps");

  return (
    <main className="min-h-screen">
      {/* Hero 区域 - 带动画 */}
      <JoinHero />

      {/* 谁适合加入？ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.whoShouldJoin")}
          </h2>

          {/* 角色类型 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {roleTypes.map((role: RoleType, index: number) => (
              <RoleTypeCard key={role.title} role={role} index={index} />
            ))}
          </div>

          {/* 欢迎 vs 不欢迎 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-green-500/5 rounded-xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" size={24} className="text-green-500" />
                {t("sections.welcome")}
              </h3>
              <ul className="space-y-3">
                {welcomePositive.map((item: string, i: number) => (
                  <ChecklistItem
                    key={i}
                    text={item}
                    type="positive"
                    index={i}
                  />
                ))}
              </ul>
            </div>

            <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="XCircle" size={24} className="text-red-500" />
                {t("sections.notWelcome")}
              </h3>
              <ul className="space-y-3">
                {welcomeNegative.map((item: string, i: number) => (
                  <ChecklistItem
                    key={i}
                    text={item}
                    type="negative"
                    index={i}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 参与方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.participation")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participationMethods.map((method: ParticipationMethod) => (
              <div
                key={method.title}
                className="group bg-background rounded-xl p-6 border border-border hover:border-esap-blue/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    name={method.icon as IconName}
                    size={32}
                    className="text-esap-blue group-hover:scale-110 transition-transform"
                  />
                  <h3 className="text-xl font-bold text-foreground">
                    {method.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  {method.description}
                </p>
                <ul className="space-y-2">
                  {method.items.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-esap-blue mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {method.note && (
                  <p className="text-xs text-esap-yellow mt-4 italic">
                    {method.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 创建角色流程 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            {t("sections.characterCreation")}
          </h2>
          <p className="text-center text-foreground/70 mb-12">
            {t("sections.characterCreationSubtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {characterCreationSteps.map((step: Step, index: number) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 创作指南 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.guidelines")}
          </h2>

          {/* 核心原则 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-esap-yellow">
              {t("sections.principles")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidelinesPrinciples.map((principle: Principle) => (
                <div
                  key={principle.title}
                  className="bg-background rounded-xl p-6 border border-border hover:border-esap-yellow/50 hover:shadow-md transition-all duration-300"
                >
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    {principle.title}
                  </h4>
                  {principle.quote && (
                    <blockquote className="text-sm text-esap-pink italic mb-2">
                      "{principle.quote}"
                    </blockquote>
                  )}
                  <p className="text-sm text-foreground/70">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 注意事项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {t("sections.technicalGuidelines")}
              </h3>
              <div className="space-y-4">
                <div className="bg-green-500/5 hover:bg-green-500/10 rounded-lg p-4 border border-green-500/20 transition-colors duration-300">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon
                      name="CheckCircle"
                      size={18}
                      className="text-green-500"
                    />
                    {t("sections.canDo")}
                  </h4>
                  <ul className="space-y-1">
                    {technicalDos.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-foreground/70 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 hover:bg-red-500/10 rounded-lg p-4 border border-red-500/20 transition-colors duration-300">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="XCircle" size={18} className="text-red-500" />
                    {t("sections.shouldNotDo")}
                  </h4>
                  <ul className="space-y-1">
                    {technicalDonts.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-foreground/70 flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {t("sections.characterGuidelines")}
              </h3>
              <div className="space-y-4">
                <div className="bg-green-500/5 hover:bg-green-500/10 rounded-lg p-4 border border-green-500/20 transition-colors duration-300">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon
                      name="CheckCircle"
                      size={18}
                      className="text-green-500"
                    />
                    {t("sections.recommended")}
                  </h4>
                  <ul className="space-y-1">
                    {characterRecommended.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-foreground/70 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 hover:bg-red-500/10 rounded-lg p-4 border border-red-500/20 transition-colors duration-300">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="XCircle" size={18} className="text-red-500" />
                    {t("sections.avoid")}
                  </h4>
                  <ul className="space-y-1">
                    {characterAvoid.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-foreground/70 flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 社区文化 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.communityValues")}
          </h2>

          {/* 核心价值观 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {communityValues.map((value: CommunityValue) => (
              <div
                key={value.title}
                className="group bg-muted rounded-xl p-6 border border-border hover:border-esap-yellow/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    name={value.icon as IconName}
                    size={28}
                    className="text-esap-yellow group-hover:rotate-6 transition-transform"
                  />
                  <h3 className="text-xl font-bold text-foreground">
                    {value.title}
                  </h3>
                </div>
                {value.quote && (
                  <blockquote className="text-sm text-esap-pink italic mb-2 border-l-2 border-esap-pink/30 pl-3">
                    "{value.quote}"
                  </blockquote>
                )}
                <p className="text-sm text-foreground/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 贡献方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.contributions")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contributions.map((contribution: Contribution) => (
              <div
                key={contribution.category}
                className="group bg-background rounded-xl p-6 border border-border hover:border-esap-pink/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    name={contribution.icon as IconName}
                    size={32}
                    className="text-esap-pink group-hover:scale-110 transition-transform"
                  />
                  <h3 className="text-lg font-bold text-foreground">
                    {contribution.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(
                    contribution.types ||
                    contribution.projects ||
                    contribution.activities ||
                    []
                  ).map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-esap-blue mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {contribution.channels && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("sections.submissionChannels")}
                    </p>
                    {contribution.channels.map((channel: string, i: number) => (
                      <p key={i} className="text-xs text-foreground/60">
                        • {channel}
                      </p>
                    ))}
                  </div>
                )}
                {contribution.methods && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("sections.contributionMethods")}
                    </p>
                    {contribution.methods.map((method: string, i: number) => (
                      <p key={i} className="text-xs text-foreground/60">
                        • {method}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            {t("sections.contact")}
          </h2>
          <p className="text-center text-foreground/70 mb-8">
            {t("sections.contactPlaceholder")}
          </p>
          <ContactPlaceholder />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("sections.faq")}
          </h2>
          <FAQAccordion faqs={faqItems} />
        </div>
      </section>

      {/* 下一步 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {t("sections.nextSteps")}
          </h2>
          <p className="text-foreground/80 mb-6">
            {t("sections.nextStepsSubtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step: string, index: number) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 border border-border"
              >
                <p className="text-sm text-foreground/70">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 结语 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-foreground/80 leading-relaxed">
            {t("closing.message")}
          </p>

          <blockquote className="text-lg text-esap-pink italic border-l-4 border-esap-pink pl-6 py-2 max-w-2xl mx-auto">
            "{t("closing.quote")}"
          </blockquote>

          <p className="text-foreground/80 leading-relaxed">
            {t("closing.invitation")}
          </p>

          <p className="text-2xl font-bold text-esap-yellow mt-8">
            {t("sections.finalWelcome")}
          </p>

          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8" />

          <blockquote className="text-foreground/60 italic">
            {t("closing.finalQuote")}
          </blockquote>
        </div>
      </section>
    </main>
  );
}
