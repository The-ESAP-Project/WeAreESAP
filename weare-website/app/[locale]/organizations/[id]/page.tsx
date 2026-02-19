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

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { loadJsonFiles } from "@/lib/data-loader";
import type { Organization } from "@/types/organization";

async function getAllOrganizations(locale: string): Promise<Organization[]> {
  return loadJsonFiles<Organization>(["data", "organizations"], locale, {
    sortByOrder: true,
  });
}

async function getOrganization(
  id: string,
  locale: string
): Promise<Organization | null> {
  const orgs = await getAllOrganizations(locale);
  return orgs.find((o) => o.id === id) ?? null;
}

export async function generateStaticParams() {
  const orgs = await getAllOrganizations("zh-CN");
  return locales.flatMap((locale) => orgs.map((o) => ({ locale, id: o.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("organizations.metadata");
  const organization = await getOrganization(id, locale);

  if (!organization) {
    return {
      title: `${t("title")} - ${SITE_CONFIG.siteName}`,
    };
  }

  const title = `${organization.info.name} - ${t("title")}`;
  const description = organization.description;
  const ogImage = organization.image || DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/organizations/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: localizedUrl,
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
    alternates: {
      canonical: localizedUrl,
    },
  };
}

// UI 由 layout 中的 OrgContent 客户端组件渲染
// 本页面仅提供 metadata
export default function OrganizationDetailPage() {
  return null;
}
