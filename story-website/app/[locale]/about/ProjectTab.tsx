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

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const contributors = [
  "AptS:1547 (Yuhan Bian / 卞雨涵)",
  "AptS:1548 (Yingyin Cai / 蔡颖茵)",
];

const thirdParty = [
  { name: "Next.js", license: "MIT", url: "https://github.com/vercel/next.js" },
  { name: "React", license: "MIT", url: "https://github.com/facebook/react" },
  {
    name: "Framer Motion",
    license: "MIT",
    url: "https://github.com/framer/motion",
  },
  {
    name: "Tailwind CSS",
    license: "MIT",
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
  {
    name: "next-intl",
    license: "MIT",
    url: "https://github.com/amannn/next-intl",
  },
  {
    name: "next-themes",
    license: "MIT",
    url: "https://github.com/pacocoursey/next-themes",
  },
  {
    name: "react-icons",
    license: "MIT",
    url: "https://github.com/react-icons/react-icons",
  },
  {
    name: "styled-jsx",
    license: "MIT",
    url: "https://github.com/vercel/styled-jsx",
  },
  {
    name: "Fuse.js",
    license: "Apache 2.0",
    url: "https://github.com/krisk/Fuse",
  },
  {
    name: "TypeScript",
    license: "Apache 2.0",
    url: "https://github.com/microsoft/TypeScript",
  },
  {
    name: "Sharp",
    license: "Apache 2.0",
    url: "https://github.com/lovell/sharp",
  },
  {
    name: "Biome",
    license: "MIT / Apache 2.0",
    url: "https://github.com/biomejs/biome",
  },
  {
    name: "LXGW WenKai",
    license: "MIT",
    url: "https://github.com/chawyehsu/lxgw-wenkai-webfont",
  },
  {
    name: "Yaku Han JP",
    license: "OFL-1.1 / MIT",
    url: "https://github.com/qrac/yakuhanjp",
  },
];

const links = [
  {
    key: "github",
    href: "https://github.com/The-ESAP-Project/WeAreESAP/tree/master/story-website",
    icon: "Github" as const,
  },
  {
    key: "weare",
    href: "https://weare.esaps.net",
    icon: "BookOpen" as const,
  },
  {
    key: "website",
    href: "https://www.esaps.net/",
    icon: "Globe" as const,
  },
];

export function ProjectTab() {
  const t = useTranslations("about.project");
  const shouldReduceMotion = useReducedMotion();
  const [noticeOpen, setNoticeOpen] = useState(false);
  const toggleNotice = useCallback(() => setNoticeOpen((v) => !v), []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 项目介绍 */}
      <AnimatedSection>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-lg text-esap-pink font-medium">{t("subtitle")}</p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto" />
        </div>
      </AnimatedSection>

      {/* 相关链接 */}
      <AnimatedSection delay={0.1}>
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {t("links")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-esap-blue/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={link.icon}
                  size={24}
                  className="text-muted-foreground group-hover:text-esap-blue transition-colors"
                />
                <span className="font-medium text-foreground">
                  {t(link.key)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(`${link.key}Description`)}
              </p>
            </a>
          ))}
        </div>
      </AnimatedSection>

      {/* 团队 */}
      <AnimatedSection delay={0.2}>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {t("team")}
        </h3>
        <div className="p-5 rounded-xl border border-border bg-muted/30">
          <p className="text-muted-foreground">{t("teamDescription")}</p>
        </div>
      </AnimatedSection>

      {/* 许可协议 */}
      <AnimatedSection delay={0.3}>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {t("license")}
        </h3>
        <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-2">
          <p className="text-muted-foreground">{t("licenseContent")}</p>
          <p className="text-muted-foreground">{t("licenseCode")}</p>
        </div>
      </AnimatedSection>

      {/* 开源声明（可折叠） */}
      <AnimatedSection delay={0.4}>
        <button
          type="button"
          onClick={toggleNotice}
          className="flex items-center gap-2 text-xl font-semibold text-foreground mb-4 group"
        >
          {t("notice")}
          <motion.span
            animate={{ rotate: noticeOpen ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
          >
            <Icon
              name="ChevronDown"
              size={20}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </motion.span>
          <span className="text-sm font-normal text-muted-foreground">
            {t("noticeToggle")}
          </span>
        </button>

        <AnimatePresence>
          {noticeOpen && (
            <motion.div
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-6">
                {/* 贡献者 */}
                <div className="p-5 rounded-xl border border-border bg-muted/30">
                  <h4 className="font-medium text-foreground mb-3">
                    {t("noticeContributors")}
                  </h4>
                  <ul className="space-y-1">
                    {contributors.map((name) => (
                      <li key={name} className="text-sm text-muted-foreground">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 第三方软件 */}
                <div className="p-5 rounded-xl border border-border bg-muted/30">
                  <h4 className="font-medium text-foreground mb-3">
                    {t("noticeThirdParty")}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {thirdParty.map((dep) => (
                      <a
                        key={dep.name}
                        href={dep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors group"
                      >
                        <span className="text-foreground group-hover:text-esap-blue transition-colors">
                          {dep.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dep.license}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatedSection>
    </div>
  );
}
