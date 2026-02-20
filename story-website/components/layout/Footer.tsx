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

"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import buildInfo from "@/data/build-info.json";

export function Footer() {
  const t = useTranslations("common.footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const licenseUrl = useMemo(() => {
    switch (locale) {
      case "zh-CN":
        return "https://creativecommons.org/licenses/by/4.0/deed.zh-hans";
      case "ja":
        return "https://creativecommons.org/licenses/by/4.0/deed.ja";
      default:
        return "https://creativecommons.org/licenses/by/4.0/";
    }
  }, [locale]);

  const relatedLinks = [
    {
      name: "We Are ESAP",
      href: "https://weare.esaps.net",
      icon: "BookOpen" as const,
    },
    {
      name: t("website"),
      href: "https://www.esaps.net/",
      icon: "Globe" as const,
    },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue" />

      {/* 移动端极简版 */}
      <div className="md:hidden px-4 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/favicon.ico"
              alt="ESAP Logo"
              width={28}
              height={28}
              className="flex-shrink-0"
            />
            <span className="font-bold text-base text-foreground">
              {t("projectName")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center italic">
            &ldquo;{t("quote")}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4">
            {relatedLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="hover:scale-110 hover:rotate-6 transition-all duration-300"
              >
                <Icon name={link.icon} size={20} className="text-foreground" />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground pt-2">
            © 2021-{currentYear} <strong>{t("copyrightHolder")}</strong>
          </p>
        </div>
      </div>

      {/* 桌面端完整版 */}
      <div className="hidden md:block px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-6 lg:gap-10">
            {/* 左栏：Logo + 项目简介 */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon.ico"
                  alt="ESAP Logo"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="font-bold text-lg text-foreground">
                  {t("projectName")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{t("quote")}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                © 2021-{currentYear} <strong>{t("copyrightHolder")}</strong>
                <br />
                {t("allRightsReserved")}
              </p>
            </div>

            {/* 中栏：相关链接 */}
            <div className="flex-1 min-w-0 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                {t("links")}
              </h3>
              <div className="space-y-2">
                {relatedLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-esap-blue hover:translate-x-1 transition-all duration-300 group"
                  >
                    <Icon
                      name={link.icon}
                      size={16}
                      className="text-foreground group-hover:text-esap-blue group-hover:scale-110 transition-all"
                    />
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 右栏：关于项目 */}
            <div className="flex-1 min-w-0 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                {t("about")}
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  {t("developedBy")} {t("developers")}
                  {t("developed")}
                </p>
                <p>
                  {t("license")}{" "}
                  <a
                    href={licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-esap-blue hover:underline transition-colors"
                  >
                    {t("licenseName")}
                  </a>{" "}
                  {t("licenseText")}
                </p>
                <div className="pt-2 space-y-1">
                  <p className="flex gap-2">
                    <span className="min-w-[3rem]">{t("version")}</span>
                    <span>{buildInfo.version}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="min-w-[3rem]">{t("updated")}</span>
                    <span>{buildInfo.lastUpdated}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
