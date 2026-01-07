import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",

  // 指定 Turbopack 根目录，避免检测到主目录的 package-lock.json
  turbopack: {
    root: __dirname,
  },

  // 图片优化配置
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 年（图片不常变）
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // HTTP 缓存头配置
  async headers() {
    return [
      // 静态资源缓存（1 年）
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // API 路由缓存配置（根据需求调整）
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // 安全响应头（所有路由）
      {
        source: "/:path*",
        headers: [
          // XSS 保护
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // 防止点击劫持
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // 防止 MIME 类型嗅探
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Referrer 策略
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions Policy（限制浏览器特性）
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // 内容安全策略 (CSP)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js 需要 unsafe-eval
              "style-src 'self' 'unsafe-inline'", // Tailwind 需要 unsafe-inline
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // 压缩配置
  compress: true,

  // 生产环境优化
  reactStrictMode: true,
  poweredByHeader: false, // 移除 X-Powered-By 头（安全）

  // TypeScript 严格模式
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
