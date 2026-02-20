// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { VisualEnhancement } from "./interactive";

export interface ExplorationScene {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  hotspots: ExplorationHotspot[];
  atmosphere?: VisualEnhancement;
}

export interface ExplorationHotspot {
  id: string;
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: ExplorationContent;
  discoverable?: boolean;
}

export type ExplorationContent =
  | { type: "text"; title: string; text: string }
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "document"; title: string; paragraphs: string[] }
  | {
      type: "item";
      itemId: string;
      name: string;
      description: string;
      image?: string;
    };
