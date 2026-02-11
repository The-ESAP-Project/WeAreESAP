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
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { loadJsonFiles } from "@/lib/data-loader";
import type { CharacterCardData } from "@/types/character";
import type { Organization } from "@/types/organization";
import { OrganizationsHero } from "./OrganizationsHero";

const OrganizationsPageClient = dynamic(() =>
  import("./OrganizationsPageClient").then((mod) => ({
    default: mod.OrganizationsPageClient,
  }))
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("organizations.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const rawKeywords = t.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/organizations`;

  return {
    title,
    description,
    keywords,
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

async function getOrganizations(locale: string): Promise<Organization[]> {
  return loadJsonFiles<Organization>(["data", "organizations"], locale);
}

async function getCharacterNames(
  locale: string
): Promise<Record<string, string>> {
  const characters = await loadJsonFiles<CharacterCardData>(
    ["data", "characters"],
    locale
  );
  const map: Record<string, string> = {};
  for (const c of characters) {
    map[c.id] = c.name;
  }
  return map;
}

export default async function OrganizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [organizations, characterNames] = await Promise.all([
    getOrganizations(locale),
    getCharacterNames(locale),
  ]);
  const t = await getTranslations("organizations");

  return (
    <main className="relative min-h-screen bg-background">
      <OrganizationsHero />

      <Suspense
        fallback={
          <div
            className="flex flex-col items-center justify-center gap-6 py-20"
            style={{ minHeight: "600px" }}
          >
            <LoadingSpinner size={150} withPulse={true} />
            <p className="text-lg font-medium text-muted-foreground">
              {t("loading")}
            </p>
          </div>
        }
      >
        {organizations.length > 0 ? (
          <OrganizationsPageClient
            organizations={organizations}
            characterNames={characterNames}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
