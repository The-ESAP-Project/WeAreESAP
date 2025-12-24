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

import type { Character } from "@/types/character";
import { SITE_CONFIG } from "@/lib/constants";

interface PersonJsonLdProps {
  character: Character;
  locale: string;
}

export function PersonJsonLd({ character, locale }: PersonJsonLdProps) {
  const characterUrl = `${SITE_CONFIG.baseUrl}/${locale === "zh-CN" ? "" : `${locale}/`}characters/${character.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${characterUrl}#person`,
    name: character.name,
    alternateName: [character.code, character.nickname].filter(Boolean),
    description: character.description,
    image: character.backgroundImage
      ? `${SITE_CONFIG.baseUrl}${character.backgroundImage}`
      : undefined,
    url: characterUrl,
    jobTitle: character.role,
    additionalType: "https://schema.org/FictionalCharacter",
    mainEntityOfPage: {
      "@type": "CreativeWork",
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.baseUrl,
    },
    keywords: character.keywords?.join(", "),
    knowsAbout: character.quote,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
