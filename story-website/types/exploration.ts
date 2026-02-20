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
