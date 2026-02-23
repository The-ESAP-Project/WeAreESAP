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

import { motion } from "framer-motion";
import type React from "react";
import { memo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SponsorContentBlock } from "@/types/sponsor";

const ContentParagraph = memo(({ content }: { content: string }) => {
  return <p className="my-4 text-foreground/80 leading-relaxed">{content}</p>;
});
ContentParagraph.displayName = "ContentParagraph";

const ContentList = memo(
  ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
    const Tag = ordered ? "ol" : "ul";
    return (
      <Tag
        className={`my-4 space-y-2 ${ordered ? "list-decimal" : "list-disc"} list-inside text-foreground/80`}
      >
        {items.map((item, i) => (
          <li key={`item-${i}`} className="leading-relaxed">
            {item}
          </li>
        ))}
      </Tag>
    );
  }
);
ContentList.displayName = "ContentList";

export const ContentBlockRenderer = memo(
  ({ block }: { block: SponsorContentBlock }) => {
    switch (block.type) {
      case "paragraph":
        return <ContentParagraph content={block.content} />;
      case "list":
        return <ContentList items={block.items} ordered={block.ordered} />;
      default:
        return null;
    }
  }
);
ContentBlockRenderer.displayName = "ContentBlockRenderer";

export const SectionView = memo(
  ({
    sectionId,
    title,
    content,
    accentStyle,
  }: {
    sectionId: string;
    title: string;
    content: SponsorContentBlock[];
    accentStyle?: React.CSSProperties;
  }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.div
        id={`section-${sectionId}`}
        initial={
          shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        className="mb-8 scroll-mt-24"
      >
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span
            className={`w-1 h-6 rounded-full${accentStyle ? "" : " bg-linear-to-b from-esap-yellow via-esap-pink to-esap-blue"}`}
            style={accentStyle}
          />
          {title}
        </h3>
        <div className="space-y-4">
          {content.map((block, index) => (
            <ContentBlockRenderer
              key={`${block.type}-${index}`}
              block={block}
            />
          ))}
        </div>
      </motion.div>
    );
  }
);
SectionView.displayName = "SectionView";
