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

import { SITE_CONFIG } from "@/lib/constants";

interface WebsiteJsonLdProps {
  locale: string;
}

export function WebsiteJsonLd({ locale }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.baseUrl}/#website`,
    name: SITE_CONFIG.siteName,
    alternateName: ["The ESAP Project", SITE_CONFIG.tagline],
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.baseUrl,
    inLanguage: locale,
    creator: {
      "@type": "Organization",
      name: "The ESAP Project",
      url: SITE_CONFIG.baseUrl,
    },
    license: SITE_CONFIG.licenseUrl,
    copyrightYear: SITE_CONFIG.startYear,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
