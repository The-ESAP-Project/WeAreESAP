// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

/**
 * 项目支柱定义
 */
export interface Pillar {
  id: string;
  title: string;
  character: string;
  color: {
    primary: string;
    dark: string;
  };
  icon: string;
  traits: string[];
  quote: string;
}

/**
 * 核心价值观定义
 */
export interface Value {
  title: string;
  quote: string;
  description: string;
  icon: string;
}

/**
 * 技术基石定义
 */
export interface Technology {
  name: string;
  description: string;
  features: string[];
}

/**
 * 时间线项目定义
 */
export interface TimelineItem {
  year: string;
  event: string;
}

/**
 * 参与方式定义
 */
export interface Participation {
  role: string;
  activities: string[];
}

/**
 * 意义章节定义
 */
export interface MeaningSection {
  title: string;
  points: string[];
}
