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
 * ESAP 项目常量定义
 */

// ESAP 三色配置
export const ESAP_COLORS = {
  yellow: {
    primary: "#ffd93d",
    dark: "#ffc107",
    name: "黄色",
    character: "1547",
    role: "创造者",
  },
  pink: {
    primary: "#ff69b4",
    dark: "#ff1493",
    name: "粉色",
    character: "1548",
    role: "逆反者",
  },
  blue: {
    primary: "#4da6ff",
    dark: "#2e8fff",
    name: "蓝色",
    character: "1549",
    role: "守望者",
  },
} as const;

// 页面路由配置
export const ROUTES = {
  home: "/",
  characters: "/characters",
  project: "/project",
  tech: "/tech",
  timeline: "/timeline",
  join: "/join",
} as const;

// 网站元数据
export const SITE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://weare.esaps.net",
  siteName: "We Are ESAP",
  tagline: "向那卫星许愿",
  description:
    "The ESAP Project（逃离计划）- 一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事",
  authors: ["AptS:1547", "AptS:1548"],
  license: "CC-BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.zh-hans",
  startYear: 2021,
} as const;

// 默认图片路径
export const DEFAULT_IMAGES = {
  homepage: "/images/homepage.jpg", // 首页和默认 OG 图片
  notFound: "/images/not-found.webp", // 404 页面图片
  favicon: "/favicon.ico", // 默认图标
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  // 页面过渡动画时长
  pageTransition: 0.3,
  // 卡片悬停动画时长
  cardHover: 0.3,
  // LOGO 绘制动画
  logoDrawDuration: 0.8,
  logoDrawDelay: 0.2,
} as const;
