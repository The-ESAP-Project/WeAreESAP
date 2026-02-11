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

"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Icon, type IconName } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type {
  CodeBlock,
  ContentBlock,
  ListBlock,
  ParagraphBlock,
  SubsectionBlock,
  TableBlock,
  WarningBlock,
} from "@/types/tech";

// 警告框样式配置 - 提取到组件外部避免重复创建
const WARNING_STYLES: Record<
  string,
  { bg: string; border: string; icon: IconName; iconColor: string }
> = {
  info: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/50",
    icon: "InfoCircle",
    iconColor: "text-blue-500",
  },
  warning: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    border: "border-yellow-500/50",
    icon: "Warning",
    iconColor: "text-yellow-500",
  },
  danger: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    border: "border-red-500/50",
    icon: "Warning",
    iconColor: "text-red-500",
  },
  critical: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    border: "border-purple-500/50",
    icon: "Eye",
    iconColor: "text-purple-500",
  },
};

// 表格组件
const ContentTable = memo(({ data }: { data: TableBlock }) => {
  return (
    <div className="overflow-x-auto my-6">
      {data.caption && (
        <p className="text-sm text-muted-foreground mb-2">{data.caption}</p>
      )}
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-linear-to-r from-esap-yellow/20 via-esap-pink/20 to-esap-blue/20">
          <tr>
            {data.headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b-2 border-esap-yellow/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="px-4 py-3 text-sm text-foreground/80"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
ContentTable.displayName = "ContentTable";

// 列表组件
const ContentList = memo(({ data }: { data: ListBlock }) => {
  const ListTag = data.ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`my-4 space-y-2 ${
        data.ordered ? "list-decimal" : "list-disc"
      } list-inside text-foreground/80`}
    >
      {data.items.map((item, index) => (
        <li key={`item-${index}`} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  );
});
ContentList.displayName = "ContentList";

// 警告框组件
const ContentWarning = memo(({ data }: { data: WarningBlock }) => {
  const style = WARNING_STYLES[data.level] || WARNING_STYLES.info;

  return (
    <div className={`my-6 p-4 rounded-lg border-2 ${style.bg} ${style.border}`}>
      <div className="flex items-start gap-3">
        <Icon name={style.icon} size={28} className={style.iconColor} />
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-2">{data.title}</h4>
          <ul className="space-y-1">
            {data.content.map((line, index) => (
              <li key={`line-${index}`} className="text-sm text-foreground/80">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
ContentWarning.displayName = "ContentWarning";

// 代码块组件
const ContentCode = memo(({ data }: { data: CodeBlock }) => {
  return (
    <div className="my-6">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto border border-border">
        <code className="text-sm font-mono text-foreground">
          {data.content}
        </code>
      </pre>
    </div>
  );
});
ContentCode.displayName = "ContentCode";

// 段落组件
const ContentParagraph = memo(({ data }: { data: ParagraphBlock }) => {
  return (
    <p className="my-4 text-foreground/80 leading-relaxed">{data.content}</p>
  );
});
ContentParagraph.displayName = "ContentParagraph";

// 子章节组件
const ContentSubsection = memo(({ data }: { data: SubsectionBlock }) => {
  return (
    <div className="my-6 ml-4 pl-4 border-l-2 border-esap-blue/30">
      <h4 className="text-lg font-semibold text-foreground mb-3">
        {data.title}
      </h4>
      {data.content.map((block, index) => (
        <ContentBlockRenderer key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
});
ContentSubsection.displayName = "ContentSubsection";

// 内容块渲染器
export const ContentBlockRenderer = memo(
  ({ block }: { block: ContentBlock }) => {
    switch (block.type) {
      case "table":
        return <ContentTable data={block} />;
      case "list":
        return <ContentList data={block} />;
      case "warning":
        return <ContentWarning data={block} />;
      case "code":
        return <ContentCode data={block} />;
      case "paragraph":
        return <ContentParagraph data={block} />;
      case "subsection":
        return <ContentSubsection data={block} />;
      default:
        return null;
    }
  }
);
ContentBlockRenderer.displayName = "ContentBlockRenderer";

// 章节组件
export const SectionView = memo(
  ({
    sectionId,
    title,
    content,
    accentStyle,
  }: {
    sectionId: string;
    title: string;
    content: ContentBlock[];
    /** 自定义竖条样式，不传则使用默认 ESAP 三色渐变 */
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
        className="mb-12 scroll-mt-24"
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
