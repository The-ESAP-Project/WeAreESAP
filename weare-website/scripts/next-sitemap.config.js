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

const fs = require("fs");
const path = require("path");

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://weare.esaps.net";

// 读取目录下的 JSON 文件名（不含扩展名）
function getJsonIds(dirPath) {
  try {
    return fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // 排除自动发现的路径，全部由 additionalPaths 控制
  exclude: ["*", "/**"],

  // hreflang 由 next-sitemap 自动处理：把 loc 路径拼到每个 href 后面
  alternateRefs: [
    { href: SITE_URL, hreflang: "zh-CN" },
    { href: `${SITE_URL}/en`, hreflang: "en" },
    { href: `${SITE_URL}/ja`, hreflang: "ja" },
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
  },

  additionalPaths: async () => {
    const paths = [];
    const cwd = process.cwd();

    // hreflang base URLs（next-sitemap 会自动把 loc 路径拼到 href 后面）
    const altRefs = [
      { href: SITE_URL, hreflang: "zh-CN" },
      { href: `${SITE_URL}/en`, hreflang: "en" },
      { href: `${SITE_URL}/ja`, hreflang: "ja" },
    ];

    // 静态路由
    const staticRoutes = [
      { path: "/", priority: 1.0, changefreq: "weekly" },
      { path: "/characters", priority: 0.9, changefreq: "weekly" },
      { path: "/project", priority: 0.8, changefreq: "monthly" },
      { path: "/tech", priority: 0.8, changefreq: "monthly" },
      { path: "/organizations", priority: 0.8, changefreq: "monthly" },
      { path: "/timeline", priority: 0.7, changefreq: "monthly" },
      { path: "/join", priority: 0.7, changefreq: "monthly" },
    ];

    for (const route of staticRoutes) {
      paths.push({
        loc: route.path,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: new Date().toISOString(),
        alternateRefs: altRefs,
      });
    }

    // 角色详情页
    const characterIds = getJsonIds(
      path.join(cwd, "data", "characters", "zh-CN")
    );
    for (const id of characterIds) {
      paths.push({
        loc: `/characters/${id}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: altRefs,
      });
    }

    // 组织详情页
    const orgIds = getJsonIds(
      path.join(cwd, "data", "organizations", "shared")
    );
    for (const id of orgIds) {
      paths.push({
        loc: `/organizations/${id}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
        alternateRefs: altRefs,
      });
    }

    // 技术详情页
    const techIds = getJsonIds(path.join(cwd, "data", "tech", "shared"));
    for (const id of techIds) {
      paths.push({
        loc: `/tech/${id}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
        alternateRefs: altRefs,
      });
    }

    return paths;
  },

  autoLastmod: true,
};
