// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import {
  ContentBlock,
  TableBlock,
  ListBlock,
  WarningBlock,
  CodeBlock,
  SubsectionBlock,
  ParagraphBlock,
} from "@/types/tech";

// 表格组件
function TechTable({ data }: { data: TableBlock }) {
  return (
    <div className="overflow-x-auto my-6">
      {data.caption && (
        <p className="text-sm text-muted-foreground mb-2">{data.caption}</p>
      )}
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-esap-yellow/20 via-esap-pink/20 to-esap-blue/20">
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
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
              key={rowIndex}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
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
}

// 列表组件
function TechList({ data }: { data: ListBlock }) {
  const ListTag = data.ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`my-4 space-y-2 ${
        data.ordered ? "list-decimal" : "list-disc"
      } list-inside text-foreground/80`}
    >
      {data.items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

// 警告框组件
function TechWarning({ data }: { data: WarningBlock }) {
  const styles = {
    info: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      border: "border-blue-500/50",
      icon: "ℹ️",
    },
    warning: {
      bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      border: "border-yellow-500/50",
      icon: "⚠️",
    },
    danger: {
      bg: "bg-red-500/10 dark:bg-red-500/20",
      border: "border-red-500/50",
      icon: "🚨",
    },
  };

  const style = styles[data.level];

  return (
    <div
      className={`my-6 p-4 rounded-lg border-2 ${style.bg} ${style.border}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{style.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-2">{data.title}</h4>
          <ul className="space-y-1">
            {data.content.map((line, index) => (
              <li key={index} className="text-sm text-foreground/80">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 代码块组件
function TechCode({ data }: { data: CodeBlock }) {
  return (
    <div className="my-6">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto border border-border">
        <code className="text-sm font-mono text-foreground">{data.content}</code>
      </pre>
    </div>
  );
}

// 段落组件
function TechParagraph({ data }: { data: ParagraphBlock }) {
  return <p className="my-4 text-foreground/80 leading-relaxed">{data.content}</p>;
}

// 子章节组件
function TechSubsection({ data }: { data: SubsectionBlock }) {
  return (
    <div className="my-6 ml-4 pl-4 border-l-2 border-esap-blue/30">
      <h4 className="text-lg font-semibold text-foreground mb-3">{data.title}</h4>
      {data.content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}

// 内容块渲染器
export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "table":
      return <TechTable data={block} />;
    case "list":
      return <TechList data={block} />;
    case "warning":
      return <TechWarning data={block} />;
    case "code":
      return <TechCode data={block} />;
    case "paragraph":
      return <TechParagraph data={block} />;
    case "subsection":
      return <TechSubsection data={block} />;
    default:
      return null;
  }
}

// 章节组件
export function TechSectionView({
  title,
  content,
}: {
  title: string;
  content: ContentBlock[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-12"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-gradient-to-b from-esap-yellow via-esap-pink to-esap-blue rounded-full" />
        {title}
      </h3>
      <div className="space-y-4">
        {content.map((block, index) => (
          <ContentBlockRenderer key={index} block={block} />
        ))}
      </div>
    </motion.div>
  );
}
