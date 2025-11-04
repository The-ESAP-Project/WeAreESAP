// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { PillarCard, ValueCard, ParticipationCard } from "@/components";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目企划 - We Are ESAP",
  description: "The ESAP Project（逃离计划）- 探讨生命、意识、存在的意义",
};

async function getProjectData() {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "project",
      "overview.json"
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("获取项目企划数据失败:", error);
    return null;
  }
}

export default async function ProjectPage() {
  const data = await getProjectData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载失败</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-muted/30 to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            {data.hero.title}
          </h1>
          <p className="text-xl text-esap-blue font-semibold">
            {data.hero.subtitle}
          </p>

          {/* 引言 */}
          <blockquote className="text-lg italic text-muted-foreground max-w-3xl mx-auto border-l-4 border-esap-yellow pl-6 py-2">
            "{data.hero.quote}"
          </blockquote>

          <p className="text-foreground/80 max-w-2xl mx-auto">
            {data.hero.description}
          </p>

          {/* 分隔线 */}
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-8" />
        </div>
      </section>

      {/* 什么是"逃离"？ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            什么是"逃离"？
          </h2>
          <div className="bg-muted rounded-2xl p-8 space-y-4 border border-border">
            <p className="text-foreground/80 leading-relaxed">
              从实质上来说，我们希望每个参与到这个计划的人能够
              <strong className="text-foreground">逃离以前的自己</strong>
              ，或者说让自己沉沦的事物。
            </p>
            <p className="text-foreground/80 leading-relaxed">
              这不是逃避，而是：
            </p>
            <ul className="space-y-2 pl-6">
              {[
                "摆脱过去的束缚",
                "重新定义自己",
                "在痛苦中成长",
                "创造新的可能性",
              ].map((item, i) => (
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
        </div>
      </section>

      {/* 三大支柱理念 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            三大支柱理念
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.pillars.map((pillar: any, index: number) => (
              <PillarCard key={pillar.id} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            核心价值观
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.coreValues.map((value: any, index: number) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 世界观框架 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            世界观框架
          </h2>

          {/* 技术基石 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-esap-yellow">
              技术基石
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.worldview.tech.map((tech: any, index: number) => (
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
          </div>

          {/* 故事背景 */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-esap-blue">故事背景</h3>
            <div className="bg-muted rounded-xl p-8 border border-border">
              <div className="space-y-4">
                {data.worldview.timeline.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="text-esap-blue font-mono font-semibold text-sm min-w-[80px]">
                      {item.year}
                    </span>
                    <span className="text-foreground/70">{item.event}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-foreground/70 italic border-t border-border pt-6">
                从此，三个仿生人在人类世界中生活、成长、探索生命的意义。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 参与方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            参与方式
          </h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            如果你对科幻世界观感兴趣，喜欢思考深层次的哲学问题，想要表达自己的情感和想法，愿意与他人分享创作，正在寻找一个"逃离"的出口——
            <strong className="text-esap-pink"> ESAP 欢迎你</strong>。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.participation.map((p: any, index: number) => (
              <ParticipationCard key={p.role} participation={p} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ESAP 的意义 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            ESAP 的意义
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              data.meaning.forCreators,
              data.meaning.forParticipants,
              data.meaning.forWorld,
            ].map((section: any, index: number) => (
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
          <h2 className="text-3xl font-bold text-foreground">
            {data.triangleSymbol.title}
          </h2>
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
            "你在这个世界上是独一无二的，不要被别人控制了"
          </blockquote>
        </div>
      </section>

      {/* 结语 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-foreground/80 leading-relaxed">
            这个世界太过复杂，我们常常感到迷失。
          </p>
          <p className="text-foreground/80 leading-relaxed">
            但或许，当你仰望天空，看到那颗人造的卫星时，你会想起：
          </p>
          <div className="space-y-2 text-lg font-semibold">
            <p className="text-foreground">
              即使失去了自然的星空，我们依然可以许愿。
            </p>
            <p className="text-foreground">
              不是因为相信童话会成真，而是因为许愿意味着你还没有放弃。
            </p>
          </div>
          <p className="text-xl text-esap-yellow font-bold mt-8">
            向那卫星许下你的愿望吧。
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-8" />
          <p className="text-sm text-muted-foreground italic">
            The ESAP Project - 我们终将逃离
          </p>
        </div>
      </section>
    </main>
  );
}
