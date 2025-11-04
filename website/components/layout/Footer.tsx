// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations, useLocale } from "next-intl";

/**
 * 全局底部栏组件
 */
export function Footer() {
  const tFooter = useTranslations("common.footer");
  const locale = useLocale();

  // 根据语言生成许可证链接
  const getLicenseUrl = () => {
    switch (locale) {
      case "zh-CN":
        return "https://creativecommons.org/licenses/by/4.0/deed.zh-hans";
      case "ja":
        return "https://creativecommons.org/licenses/by/4.0/deed.ja";
      default:
        return "https://creativecommons.org/licenses/by/4.0/";
    }
  };

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p className="italic">"{tFooter("quote")}"</p>
        <p>
          <strong>{tFooter("projectName")}</strong> © 2021-2025{" "}
          {tFooter("developedBy")} {tFooter("developers")}
          {tFooter("developed")}
        </p>
        <p>
          {tFooter("license")}{" "}
          <a
            href={getLicenseUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-esap-blue hover:underline transition-colors"
          >
            {tFooter("licenseName")}
          </a>{" "}
          {tFooter("licenseText")}
        </p>
      </div>
    </footer>
  );
}
