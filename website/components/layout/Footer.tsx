// Copyright 2025 AptS:1547, AptS:1548
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

import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import buildInfo from "@/data/build-info.json";
import { DEFAULT_IMAGES } from "@/lib/constants";

/**
 * 全局底部栏组件
 */
export function Footer() {
  const tFooter = useTranslations("common.footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  // 根据语言生成许可证链接（缓存结果,只在 locale 变化时重新计算）
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

  // 社交平台链接
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/The-ESAP-Project/",
      icon: "Github" as const,
    },
    {
      name: "QQ",
      href: "https://qm.qq.com/q/J9Js2rl7CG",
      icon: "MessageCircle" as const,
    },
    {
      name: "Discord",
      href: "#",
      icon: "Discord" as const,
      disabled: true,
    },
    {
      name: tFooter("website"),
      href: "https://www.esaps.net/",
      icon: "Globe" as const,
    },
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* ESAP三色渐变装饰线 */}
      <div className="h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue" />

      {/* 移动端极简版 */}
      <div className="md:hidden px-4 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Logo + 项目名 */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src={DEFAULT_IMAGES.favicon}
              alt="ESAP Logo"
              width={28}
              height={28}
              className="flex-shrink-0"
            />
            <span className="font-bold text-base text-foreground">
              {tFooter("projectName")}
            </span>
          </div>

          {/* 标语 */}
          <p className="text-xs text-muted-foreground text-center italic">
            "{tFooter("quote")}"
          </p>

          {/* 社交图标（横向排列） */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link, index) => (
              <div key={index}>
                {link.disabled ? (
                  <div className="cursor-not-allowed opacity-50">
                    <Icon
                      name={link.icon}
                      size={20}
                      className="text-foreground"
                    />
                  </div>
                ) : (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 hover:rotate-6 transition-all duration-300"
                    aria-label={link.name}
                  >
                    <Icon
                      name={link.icon}
                      size={20}
                      className="text-foreground"
                    />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* 版权声明 */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            © 2021-{currentYear} <strong>{tFooter("projectName")}</strong>
          </p>
        </div>
      </div>

      {/* 桌面端完整版 */}
      <div className="hidden md:block px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* 3栏布局 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* 左栏：Logo + 项目简介 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={DEFAULT_IMAGES.favicon}
                  alt="ESAP Logo"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="font-bold text-lg text-foreground">
                  {tFooter("projectName")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{tFooter("quote")}"
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                © 2021-2025 <strong>{tFooter("projectName")}</strong>
                <br />
                {tFooter("allRightsReserved")}
              </p>
            </div>

            {/* 中栏：社交平台（2列网格） */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                {tFooter("social")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link, index) => (
                  <div key={index}>
                    {link.disabled ? (
                      <div className="flex items-center gap-2 text-sm cursor-not-allowed opacity-50">
                        <Icon
                          name={link.icon}
                          size={16}
                          className="text-foreground"
                        />
                        <span className="text-xs text-muted-foreground">
                          {link.name}
                        </span>
                      </div>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-esap-blue hover:translate-x-1 transition-all duration-300 group"
                      >
                        <Icon
                          name={link.icon}
                          size={16}
                          className="text-foreground group-hover:text-esap-blue group-hover:scale-110 group-hover:rotate-3 transition-all"
                        />
                        <span className="text-xs">{link.name}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 右栏：关于项目 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                {tFooter("about")}
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  {tFooter("developedBy")} {tFooter("developers")}
                  {tFooter("developed")}
                </p>
                <p>
                  {tFooter("license")}{" "}
                  <a
                    href={licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-esap-blue hover:underline transition-colors"
                  >
                    {tFooter("licenseName")}
                  </a>{" "}
                  {tFooter("licenseText")}
                </p>
                <div className="pt-2 space-y-1">
                  <p className="flex gap-2">
                    <span className="min-w-[3rem]">{tFooter("version")}</span>
                    <span>{buildInfo.version}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="min-w-[3rem]">{tFooter("updated")}</span>
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
