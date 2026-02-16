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

import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadJsonFiles } from "@/lib/data-loader";
import type { CharacterCardData } from "@/types/character";
import type { Organization } from "@/types/organization";
import { OrganizationsHero } from "./OrganizationsHero";
import { OrgContent } from "./OrgContent";

async function getOrganizations(locale: string): Promise<Organization[]> {
  return loadJsonFiles<Organization>(["data", "organizations"], locale, {
    sortByOrder: true,
  });
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

export default async function OrganizationsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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

      {organizations.length > 0 ? (
        <OrgContent
          organizations={organizations}
          characterNames={characterNames}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      )}

      {/* [id]/page.tsx 只负责 metadata，不渲染 UI */}
      {children}
    </main>
  );
}
