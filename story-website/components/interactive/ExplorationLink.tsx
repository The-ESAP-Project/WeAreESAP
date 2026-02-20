// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StoryExplorationLinkBlock } from "@/types/chapter";

interface ExplorationLinkProps {
  data: StoryExplorationLinkBlock;
  storySlug: string;
}

export function ExplorationLink({ data, storySlug }: ExplorationLinkProps) {
  const t = useTranslations("reader.exploration");

  return (
    <div className="my-6">
      <Link
        href={`/stories/${storySlug}/explore/${data.sceneId}`}
        className="block p-4 rounded-lg border border-esap-blue/30 bg-esap-blue/5 hover:border-esap-blue/50 transition-colors group"
      >
        <p className="text-sm font-medium text-esap-blue group-hover:underline">
          {t("explore")} {data.text}
        </p>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {data.description}
          </p>
        )}
      </Link>
    </div>
  );
}
