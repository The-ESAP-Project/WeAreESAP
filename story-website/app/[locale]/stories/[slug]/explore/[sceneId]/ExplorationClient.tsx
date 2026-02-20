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
