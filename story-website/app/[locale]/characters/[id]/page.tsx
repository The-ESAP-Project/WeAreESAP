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
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import {
  getCharacterRelatedContent,
  loadCharacter,
} from "@/lib/character-loader";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { buildAlternates } from "@/lib/metadata";
import { CharacterDetail } from "./CharacterDetail";

const CHARACTER_IDS = [
  "1547",
  "1548",
  "1549",
  "1738",
  "4869",
  "0152",
  "1543",
  "2275",
  "3167",
];

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    CHARACTER_IDS.map((id) => ({ locale, id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const character = await loadCharacter(id, locale);
  if (!character) return {};

  const alternates = buildAlternates(locale, `/characters/${id}`);
  const title = `${character.name} (${character.code})`;
  const description = character.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: alternates.canonical,
      siteName: SITE_CONFIG.siteName,
      images: [
        {
          url: DEFAULT_IMAGES.ogDefault,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGES.ogDefault],
    },
    alternates,
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [character, relatedContent] = await Promise.all([
    loadCharacter(id, locale),
    getCharacterRelatedContent(id, locale),
  ]);

  if (!character) notFound();

  return (
    <CharacterDetail character={character} relatedContent={relatedContent} />
  );
}
