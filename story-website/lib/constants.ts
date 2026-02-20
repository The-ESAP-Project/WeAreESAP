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

export const ESAP_COLORS = {
  yellow: {
    primary: "#ffd93d",
    dark: "#ffc107",
    name: "黄色",
    character: "1547",
  },
  pink: {
    primary: "#ff69b4",
    dark: "#ff1493",
    name: "粉色",
    character: "1548",
  },
  blue: {
    primary: "#4da6ff",
    dark: "#2e8fff",
    name: "蓝色",
    character: "1549",
  },
} as const;

export const CHARACTER_COLORS: Record<
  string,
  { primary: string; dark: string }
> = {
  "1547": { primary: "#ffd93d", dark: "#ffc107" },
  "1548": { primary: "#ff69b4", dark: "#ff1493" },
  "1549": { primary: "#4da6ff", dark: "#2e8fff" },
};

export const ROUTES = {
  home: "/",
  stories: "/stories",
} as const;

export const SITE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://story.esaps.net",
  siteName: "ESAP Stories",
  tagline: "用故事回答「活着到底算什么」",
  description: "逃离计划故事站 —— 支持交互式叙事的科幻故事阅读平台",
  authors: ["AptS:1547", "AptS:1548"],
  license: "CC-BY 4.0",
  startYear: 2021,
} as const;

export const DEFAULT_IMAGES = {
  favicon: "/favicon.ico",
  ogDefault: "/assets/images/og-default.webp",
} as const;

export const ANIMATION_CONFIG = {
  pageTransition: 0.3,
  cardHover: 0.3,
} as const;
