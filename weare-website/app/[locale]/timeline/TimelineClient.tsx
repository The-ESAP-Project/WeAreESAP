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

import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  TimelineAtmosphere,
  TimelineEventCard,
  TimelineLine,
  TimelineYearNav,
} from "@/components";
import { useActiveYearObserver } from "@/hooks/useActiveYearObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TimelineYear } from "@/types/timeline";

interface TimelineClientProps {
  years: TimelineYear[];
}

/**
 * 年份标题带视差效果的包装组件
 */
function YearHeading({
  year,
  setYearRef,
}: {
  year: TimelineYear;
  setYearRef: (year: string, el: HTMLDivElement | null) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div
      ref={(el) => {
        // 同时设置两个 ref：一个给 IntersectionObserver，一个给视差
        (headingRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el;
        setYearRef(year.year, el);
      }}
      id={`year-${year.year}`}
      data-year={year.year}
      className="text-center mb-12 md:mb-16"
    >
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : y }}
        className="inline-block"
      >
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
      </motion.div>
    </div>
  );
}

export function TimelineClient({ years }: TimelineClientProps) {
  // 总事件数
  const totalEvents = years.reduce((sum, year) => sum + year.events.length, 0);

  // 年份列表（给导航和 observer 用）
  const yearStrings = useMemo(() => years.map((y) => y.year), [years]);

  // 当前激活的年份
  const { activeYear, setYearRef } = useActiveYearObserver(yearStrings);

  // 展开/折叠状态：critical 事件默认展开
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const year of years) {
      for (const event of year.events) {
        if (event.importance === "critical") {
          initial.add(event.id);
        }
      }
    }
    return initial;
  });

  const toggleExpand = useCallback((eventId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  }, []);

  // 年份导航的数据
  const yearNavData = useMemo(
    () => years.map(({ year, title }) => ({ year, title })),
    [years]
  );

  // 年份导航点击回调（这里不需要额外操作，scroll 会自动触发 observer 更新 activeYear）
  const handleYearClick = useCallback(() => {}, []);

  return (
    <>
      {/* 背景氛围层 */}
      <TimelineAtmosphere activeYear={activeYear} />

      {/* 年份快速导航 */}
      <TimelineYearNav
        years={yearNavData}
        activeYear={activeYear}
        onYearClick={handleYearClick}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
        {/* SVG 时间线 */}
        <TimelineLine totalEvents={totalEvents} />

        {/* 事件列表 */}
        <div className="relative pl-8 md:pl-0">
          {years.map((year, yearIndex) => (
            <div key={year.year} className="mb-16 md:mb-20">
              {/* 年份标题（带视差 + observer ref） */}
              <YearHeading year={year} setYearRef={setYearRef} />

              {/* 该年份的事件 */}
              {year.events.map((event, eventIndex) => {
                const globalIndex =
                  years
                    .slice(0, yearIndex)
                    .reduce((sum, y) => sum + y.events.length, 0) + eventIndex;

                const isLeft = globalIndex % 2 === 0;

                return (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    isLeft={isLeft}
                    isExpanded={expandedIds.has(event.id)}
                    onToggleExpand={() => toggleExpand(event.id)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
