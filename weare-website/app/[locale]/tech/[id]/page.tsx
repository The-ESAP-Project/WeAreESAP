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
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { loadJsonFiles } from "@/lib/data-loader";
import { buildAlternates } from "@/lib/metadata";
import type { TechModule } from "@/types/tech";

async function getAllTechModules(locale: string): Promise<TechModule[]> {
  return loadJsonFiles<TechModule>(["data", "tech"], locale, {
    sortByOrder: true,
  });
}

async function getTechModule(
  id: string,
  locale: string
): Promise<TechModule | null> {
  const modules = await getAllTechModules(locale);
  return modules.find((m) => m.id === id) ?? null;
}

export async function generateStaticParams() {
  const modules = await getAllTechModules("zh-CN");
  return locales.flatMap((locale) =>
    modules.map((m) => ({ locale, id: m.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tech.metadata");
  const techModule = await getTechModule(id, locale);

  if (!techModule) {
    return {
      title: `${t("title")} - ${SITE_CONFIG.siteName}`,
    };
  }

  const title = `${techModule.name} - ${t("title")}`;
  const description = techModule.description;
  const ogImage = DEFAULT_IMAGES.homepage;
  const alternates = buildAlternates(locale, `/tech/${id}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.siteName,
        },
      ],
      siteName: SITE_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates,
  };
}

// UI 由 layout 中的 TechContent 客户端组件渲染
// 本页面仅提供 metadata
export default function TechDetailPage() {
  return null;
}
