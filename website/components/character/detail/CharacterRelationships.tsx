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

"use client";

import dynamic from "next/dynamic";
import { Character } from "@/types/character";
import { Relationship } from "@/types/relationship";
import { RelationshipNodeData } from "@/types/relationship-node";
import { Icon } from "@/components/ui";
import { useTranslations } from "next-intl";
import { RelationshipGraphErrorBoundary } from "./RelationshipGraphErrorBoundary";

// 懒加载关系图谱组件
const RelationshipGraph = dynamic(() => import("./RelationshipGraph"), {
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
});

interface CharacterRelationshipsProps {
  character: Character;
  relationships: Relationship[];
  relatedCharactersData: Record<string, RelationshipNodeData>;
}

export function CharacterRelationships({
  character,
  relationships,
  relatedCharactersData,
}: CharacterRelationshipsProps) {
  const t = useTranslations("characters");
  // 从 meta 读取关系文字描述
  const relationship = character.meta?.relationship as string | undefined;

  // 如果既没有文字描述也没有关系数据，则不显示
  if (!relationship && relationships.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="relationships">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.relationships")}
      </h2>

      <div className="bg-muted rounded-2xl p-8 md:p-10">
        {/* 文字描述 */}
        {relationship && (
          <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {relationship}
            </p>
          </div>
        )}

        {/* 关系图谱可视化 */}
        {relationships.length > 0 && (
          <div className={relationship ? "mt-8" : ""}>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Icon name="Users" size={24} className="text-primary" />
              {t("detail.relationships.graphTitle")}
            </h3>
            <RelationshipGraphErrorBoundary>
              <RelationshipGraph
                character={character}
                relationships={relationships}
                relatedCharactersData={relatedCharactersData}
              />
            </RelationshipGraphErrorBoundary>
          </div>
        )}
      </div>
    </section>
  );
}
