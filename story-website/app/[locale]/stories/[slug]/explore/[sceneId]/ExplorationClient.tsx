// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { ExplorationZone } from "@/components/interactive/ExplorationZone";
import { Link } from "@/i18n/navigation";
import type { ExplorationScene } from "@/types/exploration";

interface ExplorationClientProps {
  scene: ExplorationScene;
  storySlug: string;
}

export function ExplorationClient({
  scene,
  storySlug,
}: ExplorationClientProps) {
  const t = useTranslations("reader.exploration");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href={`/stories/${storySlug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {t("back")}
        </Link>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{scene.description}</p>
      <ExplorationZone scene={scene} storySlug={storySlug} />
    </div>
  );
}
