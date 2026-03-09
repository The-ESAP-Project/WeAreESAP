"use client";

import { useTranslations } from "next-intl";
import buildInfo from "@/data/build-info.json";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("common.footer");
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > SITE_CONFIG.startYear
      ? `${SITE_CONFIG.startYear}-${currentYear}`
      : `${SITE_CONFIG.startYear}`;

  return (
    <footer className="border-t border-border">
      {/* Three-color gradient bar */}
      <div className="h-px bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Left: Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>
              &copy; {yearRange} {t("copyright")}. {t("allRightsReserved")}.
            </p>
            <p className="mt-1 font-mono text-xs">
              {t("version")} {buildInfo.version}
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p className="font-medium text-foreground text-xs uppercase tracking-wider">
                {t("projects")}
              </p>
              <a
                href={EXTERNAL_LINKS.weareWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-foreground"
              >
                {t("weareWebsite")}
              </a>
              <a
                href={EXTERNAL_LINKS.storyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-foreground"
              >
                {t("storyWebsite")}
              </a>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground text-xs uppercase tracking-wider">
                {t("social")}
              </p>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-foreground"
              >
                {t("github")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
