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

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useReadingState } from "@/hooks/useReadingState";
import { cn } from "@/lib/utils";
import type {
  ExplorationContent,
  ExplorationHotspot,
  ExplorationScene,
} from "@/types/exploration";

interface ExplorationZoneProps {
  scene: ExplorationScene;
  storySlug: string;
}

export function ExplorationZone({ scene, storySlug }: ExplorationZoneProps) {
  const t = useTranslations("reader.exploration");
  const { storyState, discoverItem } = useReadingState(storySlug);
  const [activeHotspot, setActiveHotspot] = useState<ExplorationHotspot | null>(
    null
  );

  const discoveredItems = storyState.discoveredItems[scene.id] ?? [];
  const totalDiscoverable = scene.hotspots.filter((h) => h.discoverable).length;

  const handleHotspotClick = (hotspot: ExplorationHotspot) => {
    setActiveHotspot(hotspot);
    if (hotspot.discoverable && hotspot.content.type === "item") {
      discoverItem(scene.id, hotspot.content.itemId);
    } else if (hotspot.discoverable) {
      discoverItem(scene.id, hotspot.id);
    }
  };

  return (
    <div className="relative">
      {/* Scene header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{scene.title}</h2>
        <span className="text-xs text-muted-foreground">
          {t("discovered")} {discoveredItems.length}
          {t("of")}
          {totalDiscoverable} {t("items")}
        </span>
      </div>

      {/* Scene area */}
      <div
        className={cn(
          "relative w-full aspect-video rounded-xl overflow-hidden bg-muted",
          scene.atmosphere?.mood && `mood-${scene.atmosphere.mood}`
        )}
        style={{
          backgroundImage: scene.backgroundImage
            ? `url(${scene.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Hotspots */}
        {scene.hotspots.map((hotspot) => {
          const isDiscovered =
            hotspot.discoverable &&
            discoveredItems.includes(
              hotspot.content.type === "item"
                ? hotspot.content.itemId
                : hotspot.id
            );

          return (
            <button
              type="button"
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              className={cn(
                "absolute rounded-lg transition-all hover:scale-105 group",
                isDiscovered
                  ? "border-2 border-esap-blue/50 bg-esap-blue/10"
                  : "border-2 border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10"
              )}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
                width: `${hotspot.size.width}%`,
                height: `${hotspot.size.height}%`,
              }}
              aria-label={hotspot.label}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {hotspot.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content modal */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-5 rounded-xl border border-border bg-background"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-bold text-foreground">
                {activeHotspot.label}
              </h3>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-muted-foreground hover:text-foreground text-lg"
              >
                &times;
              </button>
            </div>
            <HotspotContent content={activeHotspot.content} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HotspotContent({ content }: { content: ExplorationContent }) {
  switch (content.type) {
    case "text":
      return (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-1">
            {content.title}
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {content.text}
          </p>
        </div>
      );
    case "dialogue":
      return (
        <div className="pl-3 border-l-2 border-esap-blue/30">
          <span className="text-xs font-medium text-esap-blue">
            {content.speaker}
          </span>
          <p className="text-sm text-foreground/90 mt-0.5">{content.text}</p>
        </div>
      );
    case "document":
      return (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">
            {content.title}
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground font-mono bg-muted/50 p-3 rounded">
            {content.paragraphs.map((p, i) => (
              <p key={`doc-para-${i}`}>{p}</p>
            ))}
          </div>
        </div>
      );
    case "item":
      return (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-1">
            {content.name}
          </h4>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>
      );
    default:
      return null;
  }
}
