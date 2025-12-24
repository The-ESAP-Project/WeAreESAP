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
 * 搜索相关类型定义
 */

export type SearchResultType = "character" | "tech" | "timeline";

export interface SearchItem {
  /** 唯一标识 */
  id: string;
  /** 结果类型 */
  type: SearchResultType;
  /** 标题 (角色名/技术名/事件标题) */
  title: string;
  /** 副标题 (角色代号/描述/日期) */
  subtitle?: string;
  /** 搜索内容 */
  description: string;
  /** 跳转链接 */
  url: string;
  /** 关键词 */
  keywords?: string[];
  /** 主题色 */
  color?: string;
}
