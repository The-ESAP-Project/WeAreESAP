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

import { IconName } from "@/components/ui";

/**
 * 技术设定数据类型定义
 */

// 内容块类型
export type ContentBlock =
  | ParagraphBlock
  | TableBlock
  | ListBlock
  | WarningBlock
  | CodeBlock
  | SubsectionBlock;

// 段落
export interface ParagraphBlock {
  type: "paragraph";
  content: string;
}

// 表格
export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
}

// 列表
export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}

// 警告框
export interface WarningBlock {
  type: "warning";
  level: "info" | "warning" | "danger";
  title: string;
  content: string[];
}

// 代码块
export interface CodeBlock {
  type: "code";
  language?: string;
  content: string;
}

// 子章节
export interface SubsectionBlock {
  type: "subsection";
  title: string;
  content: ContentBlock[];
}

// 章节
export interface TechSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

// 技术模块
export interface TechModule {
  id: string;
  name: string;
  icon?: IconName;
  color: {
    primary: string;
    dark: string;
  };
  description: string;
  sections: TechSection[];
}

// API 响应类型
export interface TechModulesResponse {
  modules: TechModule[];
  total: number;
}

export interface TechModuleResponse {
  module: TechModule;
}
