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

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/request";
import { SITE_CONFIG } from "@/lib/constants";
import { buildAlternates } from "@/lib/metadata";
import { loadStory, loadStoryRegistry } from "@/lib/story-loader";
import { RssCopyButton } from "./RssCopyButton";

const LOCALE_PREFIX: Record<string, string> = {
  "zh-CN": "",
  en: "/en",
  ja: "/ja",
};

const LOCALE_LABEL: Record<string, string> = {
  "zh-CN": "中文",
  en: "English",
  ja: "日本語",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rss.metadata");
  const alternates = buildAlternates(locale, "/feed");

  return {
    title: t("title"),
    description: t("description"),
    alternates,
  };
}

export default async function RssPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rss");

  const registry = await loadStoryRegistry();
  const stories = (
    await Promise.all(registry.map((entry) => loadStory(entry.slug, locale)))
  ).filter(
    (s): s is NonNullable<typeof s> => s !== null && s.status !== "draft"
  );
  stories.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const prefix = LOCALE_PREFIX[locale] ?? "";
  const feedUrl = `${SITE_CONFIG.baseUrl}${prefix}/rss.xml`;
  const otherLocales = locales.filter((l) => l !== locale);

  const dateLocale = locale === "zh-CN" ? "zh-CN" : locale;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatedSection>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Rss" size={28} className="text-orange-500" />
              <h1 className="text-3xl font-bold text-foreground">
                {t("title")}
              </h1>
            </div>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>

          {/* Current locale feed URL */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("feedUrl")}
            </h2>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <span className="flex-1 font-mono text-sm truncate text-foreground">
                {feedUrl}
              </span>
              <RssCopyButton
                url={feedUrl}
                copyLabel={t("copyUrl")}
                copiedLabel={t("copied")}
              />
            </div>
          </div>

          {/* Other languages */}
          {otherLocales.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t("otherLanguages")}
              </h2>
              <div className="space-y-2">
                {otherLocales.map((l) => {
                  const lPrefix = LOCALE_PREFIX[l] ?? "";
                  const lUrl = `${SITE_CONFIG.baseUrl}${lPrefix}/rss.xml`;
                  return (
                    <div
                      key={l}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <span className="text-sm font-medium w-20 shrink-0 text-foreground">
                        {LOCALE_LABEL[l]}
                      </span>
                      <span className="flex-1 font-mono text-xs text-muted-foreground truncate">
                        {lUrl}
                      </span>
                      <RssCopyButton
                        url={lUrl}
                        copyLabel={t("copyUrl")}
                        copiedLabel={t("copied")}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent updates */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("recentUpdates")}
            </h2>
            {stories.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("noStories")}</p>
            ) : (
              <div className="space-y-1">
                {stories.slice(0, 10).map((story) => (
                  <Link
                    key={story.slug}
                    href={`/stories/${story.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-esap-blue transition-colors truncate">
                        {story.title}
                      </div>
                      {story.synopsis && (
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                          {story.synopsis}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(story.updatedAt).toLocaleDateString(dateLocale)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
