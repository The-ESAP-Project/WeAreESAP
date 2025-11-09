// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TimelineYear, TimelineEvent } from "@/types/timeline";
import { TimelineLine, TimelineEventCard } from "@/components";

interface TimelineClientProps {
  years: TimelineYear[];
}

// 虚拟列表项类型
type VirtualItem =
  | { type: "year"; year: TimelineYear }
  | {
      type: "event";
      event: TimelineEvent;
      globalIndex: number;
      isLeft: boolean;
    };

export function TimelineClient({ years }: TimelineClientProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // 计算总事件数
  const totalEvents = useMemo(
    () => years.reduce((sum, year) => sum + year.events.length, 0),
    [years]
  );

  // 扁平化数据：[年份标题, 事件1, 事件2, ..., 年份标题, 事件1, ...]
  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    let globalEventIndex = 0;

    years.forEach((year) => {
      // 添加年份标题
      items.push({ type: "year", year });

      // 添加该年份的所有事件
      year.events.forEach((event) => {
        items.push({
          type: "event",
          event,
          globalIndex: globalEventIndex,
          isLeft: globalEventIndex % 2 === 0,
        });
        globalEventIndex++;
      });
    });

    return items;
  }, [years]);

  // 创建虚拟滚动器
  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualItems[index];
      // 年份标题约 200px，事件卡片约 350px
      return item.type === "year" ? 200 : 350;
    },
    overscan: 3, // 上下各预渲染 3 个元素
  });

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
      {/* SVG 时间线 */}
      <TimelineLine totalEvents={totalEvents} />

      {/* 虚拟滚动容器 */}
      <div ref={parentRef} className="relative pl-8 md:pl-0">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = virtualItems[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {item.type === "year" ? (
                  // 年份标题
                  <div className="text-center mb-12 md:mb-16">
                    <div className="inline-block">
                      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        {item.year.year}
                      </h2>
                      <div className="text-lg md:text-xl text-muted-foreground mb-1">
                        {item.year.title}
                      </div>
                      {item.year.description && (
                        <p className="text-sm text-muted-foreground max-w-2xl px-4">
                          {item.year.description}
                        </p>
                      )}
                      <div className="w-24 md:w-32 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-4" />
                    </div>
                  </div>
                ) : (
                  // 事件卡片
                  <TimelineEventCard
                    event={item.event}
                    index={item.globalIndex}
                    isLeft={item.isLeft}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
