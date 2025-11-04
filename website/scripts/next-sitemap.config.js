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

  // 变更频率和优先级可以通过 transform 自定义
  transform: async (config, path) => {
    // 默认配置
    let priority = 0.7;
    let changefreq = "monthly";

    // 首页
    if (path === "/") {
      priority = 1.0;
      changefreq = "weekly";
    }
    // 角色列表和详情页
    else if (path.startsWith("/characters")) {
      priority = path === "/characters" ? 0.9 : 0.8;
      changefreq = "weekly";
    }
    // 项目企划和技术设定
    else if (path === "/project" || path === "/tech") {
      priority = 0.8;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  // 自动添加最后修改时间
  autoLastmod: true,
};
