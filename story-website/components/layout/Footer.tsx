// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import buildInfo from "@/data/build-info.json";

export function Footer() {
  const t = useTranslations("common.footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-foreground">{t("projectName")}</p>
            <p className="text-sm text-muted-foreground italic mt-1">
              "{t("quote")}"
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              © 2021-{currentYear} {t("projectName")}
            </p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              {t("license")}{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-esap-blue hover:underline"
              >
                {t("licenseName")}
              </a>{" "}
              {t("licenseText")}
            </p>
            <p>
              {t("version")} {buildInfo.version} · {t("updated")}{" "}
              {buildInfo.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
