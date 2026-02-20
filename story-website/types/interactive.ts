// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export interface VisualEnhancement {
  backgroundImage?: string;
  backgroundOverlay?: string;
  atmosphere?: "fog" | "rain" | "particles" | "glitch" | "static" | "snow";
  animation?: "fade-in" | "typewriter" | "shake" | "pulse" | "slide-up";
  fullScreen?: boolean;
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  mood?: "dark" | "tense" | "calm" | "dramatic" | "eerie" | "warm";
}
