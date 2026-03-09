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
    <footer>
      {/* Three-color gradient bar */}
      <div className="h-px bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />

      <div className="bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <p className="text-lg font-bold text-foreground tracking-tight">
                ESAP
              </p>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Creative Technology Studio
              </p>
              <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                &copy; {yearRange} {t("copyright")}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed">
                {t("licenseCode")} · {t("licenseContent")} · {t("licenseBrand")}
              </p>
            </div>

            {/* Projects */}
            <div>
              <p className="font-medium text-foreground text-xs uppercase tracking-wider mb-4">
                {t("projects")}
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href={EXTERNAL_LINKS.weareWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-foreground transition-colors"
                >
                  {t("weareWebsite")}
                </a>
                <a
                  href={EXTERNAL_LINKS.storyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-foreground transition-colors"
                >
                  {t("storyWebsite")}
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="font-medium text-foreground text-xs uppercase tracking-wider mb-4">
                {t("social")}
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-foreground transition-colors"
                >
                  {t("github")}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-esap-yellow" />
              <span className="w-1.5 h-1.5 rounded-full bg-esap-pink" />
              <span className="w-1.5 h-1.5 rounded-full bg-esap-blue" />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              v{buildInfo.version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
