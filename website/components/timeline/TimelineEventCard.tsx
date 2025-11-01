// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TimelineEvent } from "@/types/timeline";
import { TimelineContentRenderer } from "./TimelineContent";

interface TimelineEventCardProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean; // 左右交替
}

// 事件类型图标
const EVENT_ICONS: Record<string, string> = {
  milestone: "🎯",
  story: "📖",
  music: "🎵",
  emotional: "💭",
  tech: "⚙️",
};

// 重要性样式
const IMPORTANCE_STYLES: Record<string, { node: string; glow: string }> = {
  critical: {
    node: "w-6 h-6 bg-gradient-to-br from-esap-yellow via-esap-pink to-esap-blue",
    glow: "shadow-[0_0_20px_rgba(255,217,61,0.6)]",
  },
  major: {
    node: "w-5 h-5 bg-gradient-to-br from-esap-pink to-esap-blue",
    glow: "shadow-[0_0_15px_rgba(255,105,180,0.5)]",
  },
  normal: {
    node: "w-4 h-4 bg-esap-blue",
    glow: "shadow-[0_0_10px_rgba(77,166,255,0.4)]",
  },
};

export function TimelineEventCard({
  event,
  index,
  isLeft,
}: TimelineEventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const importanceStyle = IMPORTANCE_STYLES[event.importance];
  const icon = EVENT_ICONS[event.type];

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center gap-8 mb-16 ${
        isLeft ? "flex-row" : "flex-row-reverse md:flex-row-reverse"
      }`}
    >
      {/* 事件卡片 */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex-1 ${isLeft ? "text-right md:text-left" : "text-left md:text-right"}`}
      >
        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-esap-yellow/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          {/* 头部：日期 + 图标 */}
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? "justify-start" : "justify-start md:justify-end"}`}>
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="text-sm font-mono text-muted-foreground">
                {event.date}
                {event.time && ` ${event.time}`}
              </div>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {event.title}
              </h3>
            </div>
          </div>

          {/* 音乐信息（如果有） */}
          {event.meta?.music && (
            <div className="mb-4 p-3 rounded-lg bg-esap-blue/10 border border-esap-blue/30">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎵</span>
                <div>
                  <div className="font-semibold text-foreground">
                    {event.meta.music.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.meta.music.artist}
                    {event.meta.music.album && ` · ${event.meta.music.album}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 内容块 */}
          <div className="space-y-3 text-left">
            {event.content.map((block, blockIndex) => (
              <TimelineContentRenderer key={blockIndex} block={block} />
            ))}
          </div>

          {/* 标签 */}
          {event.meta?.tags && event.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {event.meta.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs rounded-full bg-background/50 text-muted-foreground border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* 中间时间线节点 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="relative z-10 flex-shrink-0"
      >
        <div
          className={`${importanceStyle.node} ${importanceStyle.glow} rounded-full border-4 border-background`}
        />
      </motion.div>

      {/* 占位 */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
}
