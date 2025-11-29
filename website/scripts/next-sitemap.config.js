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

// 国际化配置 - 需要与 i18n/routing.ts 保持一致
const I18N_CONFIG = {
  locales: ["zh-CN", "en", "ja"],
  defaultLocale: "zh-CN",
  // localePrefix: "as-needed" 意味着默认语言不会有前缀，其他语言会有前缀
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://weare.esaps.net",
  generateRobotsTxt: true,
  generateIndexSitemap: false, // 网站规模不大，不需要索引 sitemap
  exclude: [
    "/api/*", // 排除 API 路由
    "/_next/*", // 排除 Next.js 内部路由
  ],

  // robots.txt 配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    additionalSitemaps: [
      // 如果以后有其他 sitemap 可以在这里添加
    ],
  },

  // 支持的语言列表
  // 根据 i18n/routing.ts 配置
  // defaultLocale: zh-CN, localePrefix: as-needed
  // 这意味着 zh-CN 不会有前缀，其他语言会有前缀
  additionalPaths: async (config) => {
    const { locales, defaultLocale } = I18N_CONFIG;
    const paths = [];

    // 定义需要生成的基础路径
    const routes = [
      { path: "/", priority: 1.0, changefreq: "weekly" },
      { path: "/characters", priority: 0.9, changefreq: "weekly" },
      { path: "/project", priority: 0.8, changefreq: "monthly" },
      { path: "/tech", priority: 0.8, changefreq: "monthly" },
      { path: "/timeline", priority: 0.7, changefreq: "monthly" },
      { path: "/join", priority: 0.7, changefreq: "monthly" },
    ];

    // 为每个路由生成所有语言版本
    for (const route of routes) {
      for (const locale of locales) {
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
        const localePath = `${localePrefix}${route.path}`;

        // 生成 alternateRefs 用于 hreflang 标签
        const alternateRefs = locales.map((l) => ({
          href: `${config.siteUrl}${l === defaultLocale ? "" : `/${l}`}${route.path}`,
          hreflang: l,
        }));

        paths.push({
          loc: localePath,
          changefreq: route.changefreq,
          priority: route.priority,
          lastmod: new Date().toISOString(),
          alternateRefs,
        });
      }
    }

    return paths;
  },

  // 变更频率和优先级可以通过 transform 自定义
  transform: async (config, path) => {
    // 默认配置
    let priority = 0.7;
    let changefreq = "monthly";

    const { locales, defaultLocale } = I18N_CONFIG;

    // 提取不带语言前缀的路径用于判断
    // 动态生成语言前缀正则，排除默认语言
    const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);
    const localeRegex = new RegExp(`^/(${nonDefaultLocales.join("|")})(\/|$)`);
    const basePath = path.replace(localeRegex, "/");

    // 首页
    if (basePath === "/") {
      priority = 1.0;
      changefreq = "weekly";
    }
    // 角色列表和详情页
    else if (basePath.startsWith("/characters")) {
      priority = basePath === "/characters" ? 0.9 : 0.8;
      changefreq = "weekly";
    }
    // 项目企划和技术设定
    else if (basePath === "/project" || basePath === "/tech") {
      priority = 0.8;
      changefreq = "monthly";
    }

    // 生成 alternateRefs 用于 hreflang 标签
    const alternateRefs = locales.map((locale) => ({
      href: `${config.siteUrl}${locale === defaultLocale ? "" : `/${locale}`}${basePath}`,
      hreflang: locale,
    }));

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    };
  },

  // 自动添加最后修改时间
  autoLastmod: true,
};
