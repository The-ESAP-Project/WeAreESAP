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

import { loadStory, loadStoryRegistry } from "./story-loader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://story.esaps.net";

export type FeedLocale = "zh-CN" | "en" | "ja";

const LOCALE_PREFIX: Record<FeedLocale, string> = {
  "zh-CN": "",
  en: "/en",
  ja: "/ja",
};

const CHANNEL_META: Record<
  FeedLocale,
  { title: string; description: string; language: string }
> = {
  "zh-CN": {
    title: "ESAP 故事平台",
    description: "向那卫星许愿",
    language: "zh-cn",
  },
  en: {
    title: "ESAP Story Platform",
    description: "Wish upon that satellite",
    language: "en",
  },
  ja: {
    title: "ESAP ストーリープラットフォーム",
    description: "あの衛星に願いを",
    language: "ja",
  },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateFeed(locale: FeedLocale): Promise<string> {
  const registry = await loadStoryRegistry();

  const stories = (
    await Promise.all(
      registry
        .filter((entry) => entry.status !== "draft")
        .map((entry) => loadStory(entry.slug, locale))
    )
  ).filter((story) => story !== null);

  stories.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const meta = CHANNEL_META[locale];
  const prefix = LOCALE_PREFIX[locale];
  const feedUrl = `${SITE_URL}${prefix}/rss.xml`;
  const siteUrl = `${SITE_URL}${prefix}`;
  const now = new Date().toUTCString();

  const items = stories.map((story) => {
    const storyUrl = `${SITE_URL}${prefix}/stories/${story.slug}`;
    const lines = [
      "  <item>",
      `    <title>${escapeXml(story.title)}</title>`,
      `    <link>${storyUrl}</link>`,
      `    <description>${escapeXml(story.synopsis ?? story.description)}</description>`,
      `    <pubDate>${new Date(story.updatedAt).toUTCString()}</pubDate>`,
      `    <guid isPermaLink="true">${storyUrl}</guid>`,
      ...story.tags.map((tag) => `    <category>${escapeXml(tag)}</category>`),
      "  </item>",
    ];
    return lines.join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(meta.title)}</title>`,
    `    <link>${siteUrl}</link>`,
    `    <description>${escapeXml(meta.description)}</description>`,
    `    <language>${meta.language}</language>`,
    `    <lastBuildDate>${now}</lastBuildDate>`,
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
