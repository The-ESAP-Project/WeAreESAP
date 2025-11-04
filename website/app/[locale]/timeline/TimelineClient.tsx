// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { TimelineYear } from "@/types/timeline";
import { TimelineLine, TimelineEventCard } from "@/components";

interface TimelineClientProps {
  years: TimelineYear[];
}

export function TimelineClient({ years }: TimelineClientProps) {
  // 计算总事件数
  const totalEvents = years.reduce((sum, year) => sum + year.events.length, 0);

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
      {/* SVG 时间线 */}
      <TimelineLine totalEvents={totalEvents} />

      {/* 事件列表 */}
      <div className="relative pl-8 md:pl-0">
        {years.map((year, yearIndex) => (
          <div key={year.year} className="mb-16 md:mb-20">
            {/* 年份标题 */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {year.year}
                </h2>
                <div className="text-lg md:text-xl text-muted-foreground mb-1">
                  {year.title}
                </div>
                {year.description && (
                  <p className="text-sm text-muted-foreground max-w-2xl px-4">
                    {year.description}
                  </p>
                )}
                <div className="w-24 md:w-32 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-4" />
              </div>
            </div>

            {/* 该年份的事件 */}
            {year.events.map((event, eventIndex) => {
              // 计算全局索引
              const globalIndex =
                years
                  .slice(0, yearIndex)
                  .reduce((sum, y) => sum + y.events.length, 0) + eventIndex;

              // 左右交替
              const isLeft = globalIndex % 2 === 0;

              return (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  index={globalIndex}
                  isLeft={isLeft}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
