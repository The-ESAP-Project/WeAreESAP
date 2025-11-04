// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import { TechModule } from "@/types/tech";
import { TechPageClient } from "./TechPageClient";
import { LoadingSpinner } from "@/components/loading";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("tech.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

async function getTechModules(locale: string): Promise<TechModule[]> {
  try {
    const fs = require("fs/promises");
    const path = require("path");

    const techDir = path.join(process.cwd(), "data", "tech", locale);
    const files = await fs.readdir(techDir);

    const modules: TechModule[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(techDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const module: TechModule = JSON.parse(fileContent);
        modules.push(module);
      }
    }

    // 暂时只返回已有的模块，后面可以添加更多
    return modules;
  } catch (error) {
    console.error("获取技术模块数据失败:", error);
    return [];
  }
}

export default async function TechPage() {
  const locale = await getLocale();
  const modules = await getTechModules(locale);
  const t = await getTranslations("tech");

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero 区域 */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-6" />
        </div>
      </section>

      {/* 技术模块内容 */}
      <Suspense
        fallback={
          <div
            className="flex flex-col items-center justify-center gap-6 py-20"
            style={{ minHeight: "600px" }}
          >
            <LoadingSpinner size={150} withPulse={true} />
            <p className="text-lg font-medium text-muted-foreground">
              {t("loading")}
            </p>
          </div>
        }
      >
        {modules.length > 0 ? (
          <TechPageClient modules={modules} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
