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

import type { IconName } from "@/components/ui";
import type { ContentBlock } from "./tech";

/**
 * 组织设定数据类型定义
 */

// 组织成员
export interface OrganizationMember {
  characterId: string;
  role: string;
  responsibilities: string[];
  permissions?: string[];
  restrictions?: string[];
  visibility: "public" | "classified";
  note?: string;
}

// 组织章节
export interface OrganizationSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

// 组织基本信息
export interface OrganizationInfo {
  name: string;
  code: string;
  fullName: string;
  affiliation: string;
  establishedTime: string;
  coreDirective?: string;
  status: "active" | "dormant" | "disbanded";
}

// 组织主题色
export interface OrganizationTheme {
  primary: string;
  accent: string;
  dark?: string;
}

// 组织
export interface Organization {
  id: string;
  image?: string;
  info: OrganizationInfo;
  icon?: IconName;
  theme: OrganizationTheme;
  description: string;
  members: OrganizationMember[];
  sections: OrganizationSection[];
}
