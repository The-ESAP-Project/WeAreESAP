// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Icon, IconName } from "@/components/ui";
import { ESAP_COLORS } from "@/lib/constants";

type SectionKey = "beginning" | "world" | "theme" | "join";

const sectionConfig: Record<
  SectionKey,
  { icon: IconName; color: string; hoverColor: string; bgGradient: string }
> = {
  beginning: {
    icon: "Sparkles",
    color: ESAP_COLORS.yellow.primary,
    hoverColor: "esap-yellow/50",
    bgGradient:
      "radial-gradient(circle at top right, rgba(255, 217, 61, 0.08), transparent 70%)",
  },
  world: {
    icon: "BookOpen",
    color: ESAP_COLORS.pink.primary,
    hoverColor: "esap-pink/50",
    bgGradient:
      "radial-gradient(circle at top right, rgba(255, 105, 180, 0.08), transparent 70%)",
  },
  theme: {
    icon: "Brain",
    color: ESAP_COLORS.blue.primary,
    hoverColor: "esap-blue/50",
    bgGradient:
      "radial-gradient(circle at top right, rgba(77, 166, 255, 0.08), transparent 70%)",
  },
  join: {
    icon: "HeartHandshake",
    color: ESAP_COLORS.yellow.primary,
    hoverColor: "esap-yellow/50",
    bgGradient:
      "radial-gradient(circle at top right, rgba(255, 217, 61, 0.08), transparent 70%)",
  },
};

export function StorySection() {
  const t = useTranslations("home");

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            {t("story.title")}
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            {t("story.intro")}
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {(["beginning", "world", "theme", "join"] as SectionKey[]).map(
            (sectionKey, index) => {
              const config = sectionConfig[sectionKey];
              const quote = t(`story.sections.${sectionKey}.quote`);
              const highlights = t.raw(
                `story.sections.${sectionKey}.highlights`
              ) as string[];

              return (
                <motion.div
                  key={sectionKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-muted/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-border hover:border-${config.color}/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
                  style={{
                    borderColor: "hsl(var(--border))",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${config.color}80`; // 50% opacity
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                  }}
                >
                  {/* 背景渐变装饰 */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: config.bgGradient }}
                  />

                  {/* 顶部装饰条 */}
                  <div
                    className="absolute top-0 left-0 h-1 w-0 group-hover:w-16 transition-all duration-300 rounded-br-full"
                    style={{
                      background: `linear-gradient(90deg, ${config.color}, transparent)`,
                    }}
                  />

                  {/* 内容区域 */}
                  <div className="relative z-10">
                    {/* 图标和标题 */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0">
                        <Icon
                          name={config.icon}
                          size={32}
                          color={config.color}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {t(`story.sections.${sectionKey}.title`)}
                        </h3>
                        {/* 引言 */}
                        <p
                          className="text-sm italic text-foreground/70 border-l-2 pl-3"
                          style={{
                            borderLeftColor: `${config.color}4D`, // 30% opacity
                          }}
                        >
                          {quote}
                        </p>
                      </div>
                    </div>

                    {/* 主要内容 */}
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      {t(`story.sections.${sectionKey}.content`)}
                    </p>

                    {/* 要点列表 */}
                    <ul className="space-y-2">
                      {highlights.map((highlight, i) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                            style={{
                              backgroundColor: config.color,
                            }}
                          />
                          <span className="text-sm text-foreground/70 leading-relaxed">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 右下角光晕 */}
                  <div
                    className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                </motion.div>
              );
            }
          )}
        </div>

        {/* 结论 */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="relative py-6">
            <div className="absolute left-0 top-1/2 w-12 h-0.5 bg-foreground/20" />
            <div className="absolute right-0 top-1/2 w-12 h-0.5 bg-foreground/20" />
            <p className="text-lg sm:text-xl font-medium text-foreground/90 italic px-16">
              {t("story.conclusion")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
