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
 * 测试用角色数据
 */
export const TEST_CHARACTERS = {
  /** AptS:1547 - 卞雨涵 */
  APTS_1547: {
    id: "1547",
    name: "Bian Yuhan",
    code: "AptS:1547",
    nickname: "47",
    tier: "core",
  },
  /** AptS:1548 - 蔡颖茵 */
  APTS_1548: {
    id: "1548",
    name: "Cai Yingyin",
    code: "AptS:1548",
    nickname: "48",
    tier: "core",
  },
  /** AptS:1549 */
  APTS_1549: {
    id: "1549",
    name: "Xiao Yuxin",
    code: "AptS:1549",
    tier: "core",
  },
  /** AptS:0152 */
  APTS_0152: {
    id: "0152",
    name: "Gu Xingche",
    code: "AptS:0152",
    tier: "core",
  },
} as const;

/**
 * URL 路由常量
 */
export const ROUTES = {
  HOME: "/",
  CHARACTERS: "/characters",
  CHARACTER_DETAIL: (id: string) => `/characters/${id}`,
  TIMELINE: "/timeline",
  TECH: "/tech",
  PROJECT: "/project",
  JOIN: "/join",
  // 多语言路由
  ZH_HOME: "/",
  EN_HOME: "/en",
  JA_HOME: "/ja",
  ZH_CHARACTERS: "/characters",
  EN_CHARACTERS: "/en/characters",
  JA_CHARACTERS: "/ja/characters",
} as const;

/**
 * 常用选择器
 */
export const SELECTORS = {
  // 导航相关
  NAV_BAR: "nav",
  NAV_LINK_HOME: 'a[href*="/"]',
  NAV_LINK_CHARACTERS: 'a[href*="/characters"]',
  NAV_LINK_TIMELINE: 'a[href*="/timeline"]',
  NAV_LINK_TECH: 'a[href*="/tech"]',
  NAV_LINK_PROJECT: 'a[href*="/project"]',
  NAV_LINK_JOIN: 'a[href*="/join"]',

  // 主题切换
  THEME_TOGGLE: '[data-testid="theme-toggle"]',

  // 语言切换
  LANGUAGE_TOGGLE: '[data-testid="language-toggle"]',
  LANGUAGE_MENU: '[role="menu"]',

  // 角色相关
  CHARACTER_CARD: '[data-testid="character-card"]',
  CHARACTER_GRID: '[data-testid="character-grid"]',
  CHARACTER_NAME: '[data-testid="character-name"]',
  CHARACTER_CODE: '[data-testid="character-code"]',

  // 角色详情页
  CHARACTER_DETAIL_HEADER: '[data-testid="character-header"]',
  CHARACTER_BASIC_INFO: '[data-testid="character-basic-info"]',
  CHARACTER_ACCORDION: '[data-testid="character-accordion"]',
  ACCORDION_SECTION: '[data-testid^="accordion-section"]',

  // 关系图谱
  RELATIONSHIP_GRAPH: '[data-testid="relationship-graph"]',
  GRAPH_NODE: "[data-node-id]",
  GRAPH_EDGE: "[data-edge-id]",
  GRAPH_MINIMAP: '[data-testid="graph-minimap"]',
  GRAPH_CONTROLS: '[data-testid="graph-controls"]',

  // 加载状态
  LOADING_SPINNER: '[data-testid="loading"]',
  LOADING_SKELETON: '[data-testid="skeleton"]',

  // 移动端
  MOBILE_MENU_BUTTON: '[data-testid="mobile-menu-button"]',
  MOBILE_MENU: '[data-testid="mobile-menu"]',
  MOBILE_MENU_OVERLAY: '[data-testid="mobile-menu-overlay"]',

  // 错误状态
  ERROR_MESSAGE: '[data-testid="error-message"]',
  NOT_FOUND: '[data-testid="not-found"]',

  // 页面特定选择器
  TIMELINE_CONTAINER: '[data-testid="timeline"]',
  TIMELINE_EVENT: '[data-testid="timeline-event"]',
  TECH_CARD: '[data-testid="tech-card"]',
  PROJECT_SECTION: '[data-testid="project-section"]',
  JOIN_FORM: '[data-testid="join-form"]',
  FAQ_ITEM: '[data-testid="faq-item"]',
} as const;

/**
 * 测试超时时间（毫秒）
 */
export const TIMEOUTS = {
  /** 短超时 - 用于简单操作 */
  SHORT: 2000,
  /** 中等超时 - 用于一般操作 */
  MEDIUM: 5000,
  /** 长超时 - 用于复杂操作 */
  LONG: 10000,
  /** 动画时间 */
  ANIMATION: 300,
  /** 页面加载超时 */
  PAGE_LOAD: 30000,
} as const;

/**
 * 视口尺寸
 */
export const VIEWPORTS = {
  /** 桌面端 - 1920x1080 */
  DESKTOP: { width: 1920, height: 1080 },
  /** 笔记本 - 1366x768 */
  LAPTOP: { width: 1366, height: 768 },
  /** 平板 - 768x1024 */
  TABLET: { width: 768, height: 1024 },
  /** 移动端 - 375x667 */
  MOBILE: { width: 375, height: 667 },
  /** iPhone 12 */
  IPHONE_12: { width: 390, height: 844 },
  /** Pixel 5 */
  PIXEL_5: { width: 393, height: 851 },
} as const;

/**
 * 测试文本内容（用于验证）
 */
export const TEST_CONTENT = {
  // 页面标题
  TITLE_HOME: "WeAreESAP",
  TITLE_CHARACTERS: "角色",
  TITLE_TIMELINE: "时间线",
  TITLE_TECH: "技术",
  TITLE_PROJECT: "项目",
  TITLE_JOIN: "加入我们",

  // 通用文本
  LOADING: "加载中",
  NOT_FOUND: "未找到",
  ERROR: "错误",

  // 角色相关
  CHARACTER_CORE_TIER: "core",
  CHARACTER_SUPPORTING_TIER: "supporting",
} as const;

/**
 * 浏览器类型
 */
export const BROWSERS = {
  CHROMIUM: "chromium",
  FIREFOX: "firefox",
  WEBKIT: "webkit",
  MOBILE_CHROME: "Mobile Chrome",
  MOBILE_SAFARI: "Mobile Safari",
} as const;

/**
 * 语言代码
 */
export const LOCALES = {
  CHINESE: "zh-CN",
  ENGLISH: "en",
  JAPANESE: "ja",
} as const;

/**
 * 主题类型
 */
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;
