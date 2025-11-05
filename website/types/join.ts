// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

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
