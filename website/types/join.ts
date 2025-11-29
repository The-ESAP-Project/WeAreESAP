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
 * 角色类型定义
 */
export interface RoleType {
  title: string;
  icon: string;
  description: string[];
}

/**
 * 参与方式定义
 */
export interface ParticipationMethod {
  title: string;
  icon: string;
  description: string;
  items: string[];
  note?: string;
}

/**
 * 角色创建步骤定义
 */
export interface Step {
  number: number;
  title: string;
  items: string[];
}

/**
 * 创作指南原则定义
 */
export interface Principle {
  title: string;
  quote?: string;
  description: string;
}

/**
 * 社区价值观定义
 */
export interface CommunityValue {
  icon: string;
  title: string;
  quote?: string;
  description: string;
}

/**
 * 贡献方式定义
 */
export interface Contribution {
  category: string;
  icon: string;
  types?: string[];
  projects?: string[];
  activities?: string[];
  channels?: string[];
  methods?: string[];
}
