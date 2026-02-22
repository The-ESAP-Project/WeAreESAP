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

import type { StoryContentBlock } from "@/types/chapter";
import { loadChapter, loadStory, loadStoryRegistry } from "./story-loader";

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

/** Extract plain text from content blocks for use as RSS description. */
function extractSummary(blocks: StoryContentBlock[], maxLength = 150): string {
  const parts: string[] = [];
  let total = 0;

  for (const block of blocks) {
    if (total >= maxLength) break;

    let text: string | undefined;

    if (block.type === "paragraph" || block.type === "internal_monologue") {
      text = block.text;
    } else if (block.type === "dialogue") {
      text = block.text;
    } else if (block.type === "quote") {
      text = block.text;
    } else if (block.type === "atmosphere") {
      // Recurse into atmosphere children
      const inner = extractSummary(block.children, maxLength - total);
      if (inner) parts.push(inner);
      total += inner.length;
      continue;
    }

    if (text) {
      const remaining = maxLength - total;
      if (text.length > remaining) {
        parts.push(`${text.slice(0, remaining)}…`);
        total = maxLength;
      } else {
        parts.push(text);
        total += text.length;
      }
    }
  }

  return parts.join(" ").trim();
}

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  guid: string;
}

const MAX_FEED_ITEMS = 50;

export async function generateFeed(locale: FeedLocale): Promise<string> {
  const registry = await loadStoryRegistry();

  const stories = (
    await Promise.all(registry.map((entry) => loadStory(entry.slug, locale)))
  ).filter(
    (story): story is NonNullable<typeof story> =>
      story !== null && story.status !== "draft"
  );

  const prefix = LOCALE_PREFIX[locale];

  // Collect (slug, chapterId, pubDate) from meta only — no chapter content loaded yet
  const candidates: {
    slug: string;
    chapterId: string;
    pubDate: Date;
    storyTitle: string;
    storyBaseUrl: string;
  }[] = [];
  for (const story of stories) {
    const storyBaseUrl = `${SITE_URL}${prefix}/stories/${story.slug}`;
    for (const chId of story.chapterOrder) {
      const pubDateStr = story.chapterPublishedAt?.[chId] ?? story.publishedAt;
      candidates.push({
        slug: story.slug,
        chapterId: chId,
        pubDate: new Date(pubDateStr),
        storyTitle: story.title,
        storyBaseUrl,
      });
    }
  }

  // Sort and cap before loading any chapter content
  candidates.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const top = candidates.slice(0, MAX_FEED_ITEMS);

  // Load only the chapters we actually need
  const items = (
    await Promise.all(
      top.map(async (c) => {
        const ch = await loadChapter(c.slug, c.chapterId, locale);
        if (!ch) return null;

        const pubDateStr =
          ch.publishedAt ??
          stories.find((s) => s.slug === c.slug)?.chapterPublishedAt?.[ch.id] ??
          c.pubDate.toISOString();

        const chapterUrl = `${c.storyBaseUrl}/${ch.id}`;
        return {
          title: `${c.storyTitle} - ${ch.title}`,
          link: chapterUrl,
          description: extractSummary(ch.content),
          pubDate: new Date(pubDateStr),
          guid: chapterUrl,
        } satisfies FeedItem;
      })
    )
  ).filter((item): item is FeedItem => item !== null);

  const meta = CHANNEL_META[locale];
  const feedUrl = `${SITE_URL}${prefix}/rss.xml`;
  const siteUrl = `${SITE_URL}${prefix}`;
  const now = new Date().toUTCString();

  const itemXml = items.map((item) => {
    const lines = [
      "  <item>",
      `    <title>${escapeXml(item.title)}</title>`,
      `    <link>${item.link}</link>`,
      `    <description>${escapeXml(item.description)}</description>`,
      `    <pubDate>${item.pubDate.toUTCString()}</pubDate>`,
      `    <guid isPermaLink="true">${item.guid}</guid>`,
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
    ...itemXml,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
