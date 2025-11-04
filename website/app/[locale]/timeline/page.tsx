// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import { TimelineYear } from "@/types/timeline";
import { TimelineClient } from "./TimelineClient";
import { LoadingSpinner } from "@/components/loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "时间线 - We Are ESAP",
  description: "探索 ESAP 世界的完整历程，从 2021 年到现在的每一个重要时刻",
};

async function getTimelineData(): Promise<TimelineYear[]> {
  try {
    const fs = require("fs/promises");
    const path = require("path");

    const timelineDir = path.join(process.cwd(), "data", "timeline");
    const files = await fs.readdir(timelineDir);

    const years: TimelineYear[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(timelineDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const yearData: TimelineYear = JSON.parse(fileContent);
        years.push(yearData);
      }
    }

    // 按年份排序
    years.sort((a, b) => a.year.localeCompare(b.year));

    return years;
  } catch (error) {
    console.error("获取时间线数据失败:", error);
    return [];
  }
}

export default async function TimelinePage() {
  const years = await getTimelineData();

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero 区域 */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
            世界观时间线
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground italic mb-4">
            "从一声枪响和馈散心脏的第一次跳动开始"
          </p>
          <p className="text-base md:text-lg text-foreground/80">
            记录 The ESAP Project 从 2021 年至今的每一个重要时刻
          </p>
          <div className="w-24 md:w-32 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-6 md:mt-8" />
        </div>
      </section>

      {/* 时间线内容 */}
      <Suspense
        fallback={
          <div
            className="flex flex-col items-center justify-center gap-6 py-20"
            style={{ minHeight: "600px" }}
          >
            <LoadingSpinner size={150} withPulse={true} />
            <p className="text-lg font-medium text-muted-foreground">
              正在加载时间线...
            </p>
          </div>
        }
      >
        {years.length > 0 ? (
          <TimelineClient years={years} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-muted-foreground">暂无时间线数据</p>
          </div>
        )}
      </Suspense>

      {/* 结尾引用 */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl text-foreground/80 italic mb-4">
            "从一声枪响和馈散心脏的第一次跳动开始"
          </p>
          <p className="text-xl md:text-2xl font-bold text-foreground">
            我们终将逃离
          </p>
        </div>
      </section>
    </main>
  );
}
