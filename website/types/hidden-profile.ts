// Copyright 2025 AptS:1547, AptS:1548
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * 角色隐藏属性类型定义
 * 用于在深色模式下通过底部上拉手势触发的隐藏内容
 */

/**
 * 互动元素配置
 */
export interface InteractiveConfig {
  /** 互动类型 */
  type: "mini-game" | "audio" | "animation" | "custom";
  /** 自定义配置参数 */
  config: Record<string, unknown>;
}

/**
 * 隐藏属性内容
 * 每个角色可以有不同类型的隐藏内容
 */
export interface HiddenProfile {
  /** 内容类型 */
  type: "text" | "image" | "mixed" | "interactive";

  /** 标题（可选） */
  title?: string;

  /** 文本内容（字符串或字符串数组） */
  content?: string | string[];

  /** 图片 URL 列表 */
  images?: string[];

  /** 互动元素配置 */
  interactive?: InteractiveConfig;

  /** 背景颜色（可选，默认使用角色主色） */
  backgroundColor?: string;

  /** 文字颜色（可选，默认使用对比色） */
  textColor?: string;
}

/**
 * 上拉触发配置
 */
export interface PullToRevealConfig {
  /** 触发阈值（像素） */
  threshold: number;

  /**
   * 阻尼系数（0-1）
   * - 1.0 = 无阻尼，完全跟随手指
   * - 0.5 = 拉到最大距离时保留 50% 的移动
   * - 0.0 = 完全阻尼，拉到最大距离时不移动
   */
  damping: number;

  /** 最大拉动距离（像素） */
  maxPullDistance: number;
}

/**
 * 默认配置
 */
export const DEFAULT_PULL_CONFIG: PullToRevealConfig = {
  threshold: 180, // 触发阈值（拉动 180px 后松手即可触发）
  damping: 0.5, // 阻尼系数（渐进式衰减，越拉越难）
  maxPullDistance: 200, // 最大拉动距离（限制在 200px）
};
