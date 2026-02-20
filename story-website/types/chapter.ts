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
import type { UnlockCondition } from "./story";

/** Chapter data — {locale}/{slug}/{chapterId}.json */
export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: StoryContentBlock[];
  visual?: VisualEnhancement;
  readingTime?: number;
  perspectiveCharacter?: string;
}

/** Content block discriminated union */
export type StoryContentBlock =
  | StoryParagraphBlock
  | StoryDialogueBlock
  | StoryInternalMonologueBlock
  | StoryQuoteBlock
  | StorySceneBreakBlock
  | StoryImageBlock
  | StoryAtmosphereBlock
  | StoryBranchBlock
  | StoryUnlockGateBlock
  | StoryExplorationLinkBlock;

export interface StoryParagraphBlock {
  type: "paragraph";
  text: string;
  visual?: VisualEnhancement;
}

export interface StoryDialogueBlock {
  type: "dialogue";
  speaker: string;
  speakerName?: string;
  text: string;
  emotion?: "neutral" | "angry" | "sad" | "happy" | "fearful" | "cold";
  visual?: VisualEnhancement;
}

export interface StoryInternalMonologueBlock {
  type: "internal_monologue";
  character: string;
  text: string;
  visual?: VisualEnhancement;
}

export interface StoryQuoteBlock {
  type: "quote";
  text: string;
  attribution?: string;
  visual?: VisualEnhancement;
}

export interface StorySceneBreakBlock {
  type: "scene_break";
  label?: string;
  style?: "dots" | "line" | "symbol" | "fade";
}

export interface StoryImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  layout?: "inline" | "full" | "float-left" | "float-right";
}

export interface StoryAtmosphereBlock {
  type: "atmosphere";
  visual: VisualEnhancement;
  children: StoryContentBlock[];
}

export interface StoryBranchBlock {
  type: "branch";
  choiceId: string;
  prompt: string;
  options: BranchOption[];
}

export interface BranchOption {
  id: string;
  text: string;
  targetChapterId: string;
  condition?: UnlockCondition;
}

export interface StoryUnlockGateBlock {
  type: "unlock_gate";
  targetId: string;
  hint: string;
  unlockedContent: StoryContentBlock[];
}

export interface StoryExplorationLinkBlock {
  type: "exploration_link";
  sceneId: string;
  text: string;
  description?: string;
}
