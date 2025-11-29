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

import {
  TimelineContentBlock,
  ParagraphBlock,
  QuoteBlock,
  DialogueBlock,
  ListBlock,
  HighlightBlock,
  LinkBlock,
} from "@/types/timeline";
import { Icon, type IconName } from "@/components/ui";

// 角色颜色映射
const CHARACTER_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  "1547": {
    bg: "bg-esap-yellow/10 dark:bg-esap-yellow/20",
    border: "border-esap-yellow/50",
    text: "text-esap-yellow-dark dark:text-esap-yellow",
  },
  "1548": {
    bg: "bg-esap-pink/10 dark:bg-esap-pink/20",
    border: "border-esap-pink/50",
    text: "text-esap-pink-dark dark:text-esap-pink",
  },
  "1549": {
    bg: "bg-esap-blue/10 dark:bg-esap-blue/20",
    border: "border-esap-blue/50",
    text: "text-esap-blue-dark dark:text-esap-blue",
  },
};

// 段落
function Paragraph({ data }: { data: ParagraphBlock }) {
  return (
    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
      {data.text}
    </p>
  );
}

// 引用块
function Quote({ data }: { data: QuoteBlock }) {
  return (
    <blockquote className="my-4 pl-4 border-l-4 border-gradient-to-b from-esap-yellow via-esap-pink to-esap-blue italic text-foreground/70 bg-muted/30 py-3 pr-4 rounded-r-lg">
      <p className="whitespace-pre-wrap leading-relaxed">{data.text}</p>
      {data.author && (
        <footer className="mt-2 text-sm text-muted-foreground">
          — {data.author}
        </footer>
      )}
    </blockquote>
  );
}

// 对话气泡
function Dialogue({ data }: { data: DialogueBlock }) {
  const colors = CHARACTER_COLORS[data.speaker] || {
    bg: "bg-muted",
    border: "border-border",
    text: "text-foreground",
  };

  return (
    <div className="my-3 flex flex-col gap-1">
      {/* 说话者标签 */}
      <div className={`text-sm font-semibold ${colors.text} ml-2`}>
        AptS:{data.speaker}
      </div>
      {/* 气泡 */}
      <div
        className={`${colors.bg} ${colors.border} border-2 rounded-2xl px-4 py-3 max-w-[85%] shadow-sm`}
      >
        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {data.text}
        </p>
      </div>
    </div>
  );
}

// 列表
function List({ data }: { data: ListBlock }) {
  const ListTag = data.ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`my-3 space-y-2 ${
        data.ordered ? "list-decimal" : "list-disc"
      } list-inside text-foreground/80 ml-2`}
    >
      {data.items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

// 高亮块
function Highlight({ data }: { data: HighlightBlock }) {
  const styles: Record<
    string,
    { bg: string; border: string; icon: IconName; iconColor: string }
  > = {
    success: {
      bg: "bg-green-500/10 dark:bg-green-500/20",
      border: "border-green-500/50",
      icon: "CheckCircle",
      iconColor: "text-green-500",
    },
    warning: {
      bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      border: "border-yellow-500/50",
      icon: "Warning",
      iconColor: "text-yellow-500",
    },
    error: {
      bg: "bg-red-500/10 dark:bg-red-500/20",
      border: "border-red-500/50",
      icon: "XCircle",
      iconColor: "text-red-500",
    },
    info: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      border: "border-blue-500/50",
      icon: "InfoCircle",
      iconColor: "text-blue-500",
    },
  };

  const style = styles[data.style || "info"];

  return (
    <div
      className={`my-4 p-4 rounded-lg border-2 ${style.bg} ${style.border} flex items-start gap-3`}
    >
      <Icon
        name={style.icon}
        size={20}
        className={`${style.iconColor} shrink-0`}
      />
      <p className="text-sm text-foreground/90 leading-relaxed flex-1 whitespace-pre-wrap">
        {data.text}
      </p>
    </div>
  );
}

// 链接卡片
function Link({ data }: { data: LinkBlock }) {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block group"
    >
      <div className="p-4 rounded-lg border-2 border-border bg-muted/30 hover:bg-muted/50 hover:border-esap-blue/50 transition-all duration-300">
        <div className="flex items-center gap-2">
          {/* 链接图标 */}
          <svg
            className="w-5 h-5 text-esap-blue flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {/* 链接文字 */}
          <span className="text-foreground font-medium group-hover:text-esap-blue transition-colors">
            {data.text}
          </span>
          {/* 外部链接指示 */}
          <svg
            className="w-4 h-4 text-muted-foreground group-hover:text-esap-blue transition-colors ml-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
        {/* 可选描述 */}
        {data.description && (
          <p className="text-sm text-muted-foreground mt-2 ml-7">
            {data.description}
          </p>
        )}
      </div>
    </a>
  );
}

// 内容块渲染器
export function TimelineContentRenderer({
  block,
}: {
  block: TimelineContentBlock;
}) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph data={block} />;
    case "quote":
      return <Quote data={block} />;
    case "dialogue":
      return <Dialogue data={block} />;
    case "list":
      return <List data={block} />;
    case "highlight":
      return <Highlight data={block} />;
    case "link":
      return <Link data={block} />;
    default:
      return null;
  }
}
