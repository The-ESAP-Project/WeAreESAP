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

import type { FeedLocale } from "@/lib/feed-generator";
import { generateAtomFeed } from "@/lib/feed-generator";

export const revalidate = 3600;

const SUPPORTED_LOCALES = new Set<string>(["en", "ja"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.has(locale)) {
    return new Response(null, { status: 404 });
  }

  const xml = await generateAtomFeed(locale as FeedLocale);
  return new Response(xml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
