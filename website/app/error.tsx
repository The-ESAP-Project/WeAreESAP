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
import { TriangleLogo, Icon } from "@/components/ui";
import Link from "next/link";
import { type Locale, defaultLocale } from "@/i18n/request";
import { logger } from "@/lib/logger";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 客户端检测语言
function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  // 1. 从 URL 路径获取
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/(zh-CN|en|ja)(\/|$)/);
  if (localeMatch) {
    return localeMatch[1] as Locale;
  }

  // 2. 从 localStorage 获取
  const stored = localStorage.getItem("NEXT_LOCALE");
  if (stored === "zh-CN" || stored === "en" || stored === "ja") {
    return stored;
  }

  // 3. 从浏览器语言获取
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

// 翻译文本
const translations = {
  "zh-CN": {
    title: "系统异常",
    heading: "系统异常",
    message: "仿生人单元遇到了一些小问题",
    description: "别担心，这不是你的错。我们的自修复系统正在尝试解决这个问题。",
    systemRecovery: "系统正在自我修复中...",
    systemStatus: "修复中...",
    retry: "重试",
    backHome: "返回首页",
    reportIssue: "报告问题",
    errorDetails: "错误详情",
    errorId: "错误编号",
    technicalDetails: "技术细节",
    contactSupport: "需要帮助？",
    supportHint:
      "请将错误编号发送给技术支持团队，以便我们更好地帮助您解决问题。",
  },
  en: {
    title: "System Error",
    heading: "System Error",
    message: "Our synthetic unit encountered an issue",
    description:
      "Don't worry, it's not your fault. Our self-repair system is trying to fix this.",
    systemRecovery: "System self-repairing...",
    systemStatus: "Repairing...",
    retry: "Retry",
    backHome: "Back to Home",
    reportIssue: "Report Issue",
    errorDetails: "Error Details",
    errorId: "Error ID",
    technicalDetails: "Technical Details",
    contactSupport: "Need Help?",
    supportHint:
      "Please send the error ID to our support team for better assistance.",
  },
  ja: {
    title: "システムエラー",
    heading: "システムエラー",
    message: "アンドロイドユニットに問題が発生しました",
    description:
      "ご心配なく、あなたのせいではありません。自己修復システムが問題解決を試みています。",
    systemRecovery: "システム自己修復中...",
    systemStatus: "修復中...",
    retry: "再試行",
    backHome: "ホームに戻る",
    reportIssue: "問題を報告",
    errorDetails: "エラー詳細",
    errorId: "エラーID",
    technicalDetails: "技術的な詳細",
    contactSupport: "サポートが必要ですか？",
    supportHint:
      "エラーIDをサポートチームに送信して、より良いサポートを受けてください。",
  },
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isRecovering, setIsRecovering] = useState(false);
  const [errorId] = useState(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  });

  useEffect(() => {
    setLocale(detectLocale());
    setTheme(detectTheme());
    logger.error("Error details:", error);
  }, [error]);

  const t = translations[locale];

  const handleRetry = () => {
    setIsRecovering(true);
    setTimeout(() => {
      reset();
      setIsRecovering(false);
    }, 1500);
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent(`Bug Report - Error ID: ${errorId}`);
    const body = encodeURIComponent(
      `
Error ID: ${errorId}
Time: ${new Date().toLocaleString()}
Browser: ${navigator.userAgent}
Page: ${window.location.href}

Error Message: ${error.message}
${error.digest ? `Digest: ${error.digest}` : ""}
    `.trim()
    );

    const mailtoUrl = `mailto:support@esaps.net?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  return (
    <html lang={locale} className={theme}>
      <head>
        <title>{t.title}</title>
      </head>
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans antialiased">
        <div className="max-w-4xl w-full">
          <div className="text-center space-y-8">
            {/* 旋转的三角形 LOGO */}
            <div className="flex justify-center">
              <div
                className={isRecovering ? "animate-pulse" : ""}
                style={{
                  animation: isRecovering
                    ? "pulse 1s ease-in-out infinite"
                    : "spin 8s linear infinite",
                }}
              >
                <TriangleLogo
                  size={120}
                  className={isRecovering ? "text-esap-yellow" : ""}
                />
              </div>
            </div>

            {/* 错误标题 */}
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Icon name="Warning" size={48} className="text-esap-yellow" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t.heading}
              </h1>

              <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto" />

              <h2 className="text-2xl md:text-3xl font-semibold text-esap-pink">
                {t.message}
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.description}
              </p>
            </div>

            {/* 系统恢复状态 */}
            {isRecovering && (
              <div className="bg-esap-yellow/10 border border-esap-yellow/30 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Icon
                    name="Warning"
                    size={20}
                    className="animate-spin text-esap-yellow"
                  />
                  <span className="text-esap-yellow font-medium">
                    {t.systemRecovery}
                  </span>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleRetry}
                disabled={isRecovering}
                className="px-8 py-3 rounded-lg bg-esap-blue text-white font-medium hover:bg-esap-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isRecovering ? t.systemStatus : t.retry}
              </button>

              <Link
                href={`/${locale}`}
                className="px-8 py-3 rounded-lg border-2 border-esap-pink text-esap-pink font-medium hover:bg-esap-pink hover:text-white transition-colors flex items-center gap-2 min-w-[140px] justify-center"
              >
                {t.backHome}
              </Link>

              <button
                onClick={handleReportIssue}
                className="px-8 py-3 rounded-lg border-2 border-esap-yellow text-esap-yellow font-medium hover:bg-esap-yellow hover:text-foreground transition-colors flex items-center gap-2 min-w-[140px] justify-center"
              >
                {t.reportIssue}
              </button>
            </div>

            {/* 错误详情（可折叠） */}
            <div className="text-left max-w-2xl mx-auto">
              <details className="bg-muted/50 rounded-lg p-4 border border-border">
                <summary className="cursor-pointer font-medium text-foreground flex items-center gap-2 hover:text-esap-blue transition-colors">
                  <Icon name="InfoCircle" size={16} />
                  {t.errorDetails}
                </summary>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">
                      {t.errorId}:
                    </span>
                    <code className="bg-background px-2 py-1 rounded text-esap-pink font-mono">
                      {errorId}
                    </code>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">
                      {t.technicalDetails}:
                    </span>
                    <span className="text-foreground/70">
                      {error.message || "Unknown error"}
                    </span>
                  </div>

                  {error.digest && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">
                        Digest:
                      </span>
                      <code className="bg-background px-2 py-1 rounded text-xs font-mono text-foreground/60">
                        {error.digest}
                      </code>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-4 p-3 bg-background rounded border border-border">
                    <p className="font-medium mb-2">{t.contactSupport}</p>
                    <p>{t.supportHint}</p>
                  </div>
                </div>
              </details>
            </div>

            {/* 趣味性的视觉元素 */}
            <div className="relative h-32 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-1 bg-linear-to-r from-transparent via-esap-pink/20 to-transparent" />
              </div>
              <div className="relative bg-background px-4">
                <Icon name="Sparkles" size={32} className="text-esap-pink" />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.95);
            }
          }
        `}</style>
      </body>
    </html>
  );
}
