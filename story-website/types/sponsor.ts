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

/** 内容块类型 */
export type SponsorContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[]; ordered?: boolean };

/** 内容区段 */
export interface SponsorSection {
  id: string;
  title: string;
  content: SponsorContentBlock[];
}

/** 主题色 */
export interface SponsorTheme {
  primary: string;
  accent: string;
}

export interface Sponsor {
  /** 赞助商唯一标识（与 JSON 文件名一致） */
  id: string;
  /** 排序序号 */
  order: number;
  /** Logo 图片路径 */
  logo?: string;
  /** 外部网站链接 */
  url?: string;
  /** Banner / Hero 图片 */
  heroImage?: string;
  /** 展示图片列表 */
  images?: string[];
  /** 自定义主题色（不提供则使用 ESAP 默认三色渐变） */
  theme?: SponsorTheme;
  /** 赞助商名称（来自 locale JSON） */
  name: string;
  /** 赞助商介绍（来自 locale JSON） */
  description: string;
  /** 富文本内容区段（来自 locale JSON） */
  sections?: SponsorSection[];
}
