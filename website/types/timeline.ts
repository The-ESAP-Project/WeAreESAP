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

/**
 * 时间线数据类型定义
 */

// 内容块类型
export type TimelineContentBlock =
  | ParagraphBlock
  | QuoteBlock
  | DialogueBlock
  | ListBlock
  | HighlightBlock
  | LinkBlock;

// 段落
export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

// 引用块
export interface QuoteBlock {
  type: "quote";
  text: string;
  author?: string;
}

// 对话
export interface DialogueBlock {
  type: "dialogue";
  speaker: string; // "1547" | "1548" | "1549" | "其他"
  text: string;
}

// 列表
export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}

// 高亮文本
export interface HighlightBlock {
  type: "highlight";
  text: string;
  style?: "success" | "warning" | "error" | "info";
}

// 链接
export interface LinkBlock {
  type: "link";
  text: string; // 链接文字
  url: string; // 链接地址
  description?: string; // 可选的描述文字
}

// 事件类型
export type EventType = "milestone" | "story" | "music" | "emotional" | "tech";

// 重要性级别
export type ImportanceLevel = "critical" | "major" | "normal";

// 音乐信息
export interface MusicInfo {
  title: string;
  artist: string;
  album?: string;
  link?: string;
}

// 时间线事件
export interface TimelineEvent {
  id: string;
  date: string; // "2021/10/29"
  time?: string; // "18:44 GMT"
  title: string;
  type: EventType;
  importance: ImportanceLevel;

  // 内容块
  content: TimelineContentBlock[];

  // 可选元数据
  meta?: {
    // 相关角色
    characters?: string[];
    // 音乐信息
    music?: MusicInfo;
    // 图片
    images?: string[];
    // 标签
    tags?: string[];
  };
}

// 年份分组
export interface TimelineYear {
  year: string; // "2021"
  title: string; // "起源与诞生"
  description?: string;
  events: TimelineEvent[];
}

// 完整时间线
export interface Timeline {
  years: TimelineYear[];
  totalEvents: number;
}
