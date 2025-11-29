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

"use client";

import { useEffect, useState } from "react";
import { type Locale, defaultLocale } from "@/i18n/request";
import { logger } from "@/lib/logger";

// 客户端检测语言
function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/(zh-CN|en|ja)(\/|$)/);
  if (localeMatch) {
    return localeMatch[1] as Locale;
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.includes("zh")) return "zh-CN";
  if (browserLang.includes("ja")) return "ja";
  if (browserLang.includes("en")) return "en";

  return defaultLocale;
}

// 客户端检测主题
function detectTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  // 1. 从 localStorage 获取
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // 2. 从系统偏好获取
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

const translations = {
  "zh-CN": {
    title: "系统错误",
    heading: "出现了严重问题",
    message: "系统遇到了意外的错误，我们已经记录了这个问题。",
    hint: "请稍后再试或联系技术支持。",
    retry: "重试",
    backHome: "返回首页",
    errorDetailsTitle: "错误详情 (开发模式)",
  },
  en: {
    title: "System Error",
    heading: "Something went seriously wrong",
    message: "The system encountered an unexpected error. We've logged it.",
    hint: "Please try again later or contact support.",
    retry: "Retry",
    backHome: "Back to Home",
    errorDetailsTitle: "Error Details (Dev Mode)",
  },
  ja: {
    title: "システムエラー",
    heading: "重大な問題が発生しました",
    message: "システムが予期しないエラーに遭遇しました。問題を記録しました。",
    hint: "しばらくしてから再試行するか、サポートにお問い合わせください。",
    retry: "再試行",
    backHome: "ホームに戻る",
    errorDetailsTitle: "エラー詳細 (開発モード)",
  },
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setLocale(detectLocale());
    setTheme(detectTheme());
    logger.error("Global error:", error);
  }, [error]);

  const t = translations[locale];

  return (
    <html lang={locale} className={theme}>
      <head>
        <title>{t.title}</title>
      </head>
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans antialiased">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-esap-yellow mb-2">!</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {t.heading}
          </h2>

          <p className="text-muted-foreground mb-2 leading-relaxed">
            {t.message}
          </p>

          <p className="text-muted-foreground mb-8 leading-relaxed">{t.hint}</p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-esap-yellow text-black font-medium rounded-lg hover:bg-esap-yellow-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-esap-yellow focus:ring-offset-2 focus:ring-offset-background"
            >
              {t.retry}
            </button>

            <button
              onClick={() => (window.location.href = `/${locale}`)}
              className="w-full px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background"
            >
              {t.backHome}
            </button>
          </div>

          {process.env.NODE_ENV === "development" && error.message && (
            <details className="mt-8 text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                {t.errorDetailsTitle}
              </summary>
              <pre className="mt-2 p-4 bg-muted text-xs text-muted-foreground rounded-lg overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
