// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { ComponentType } from "react";
import {
  LuBookOpen,
  LuChevronDown,
  LuChevronUp,
  LuEye,
  LuGlobe,
  LuLock,
  LuLockOpen,
  LuMenu,
  LuMessageCircle,
  LuMoon,
  LuSearch,
  LuSettings,
  LuSun,
  LuX,
} from "react-icons/lu";
import { SiDiscord, SiGithub } from "react-icons/si";

export type IconName =
  | "Globe"
  | "Github"
  | "Discord"
  | "MessageCircle"
  | "BookOpen"
  | "Settings"
  | "Search"
  | "Eye"
  | "Lock"
  | "LockOpen"
  | "Menu"
  | "X"
  | "Sun"
  | "Moon"
  | "ChevronDown"
  | "ChevronUp";

const iconMap: Record<IconName, ComponentType<{ className?: string }>> = {
  Globe: LuGlobe,
  Github: SiGithub,
  Discord: SiDiscord,
  MessageCircle: LuMessageCircle,
  BookOpen: LuBookOpen,
  Settings: LuSettings,
  Search: LuSearch,
  Eye: LuEye,
  Lock: LuLock,
  LockOpen: LuLockOpen,
  Menu: LuMenu,
  X: LuX,
  Sun: LuSun,
  Moon: LuMoon,
  ChevronDown: LuChevronDown,
  ChevronUp: LuChevronUp,
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 20, color, className = "" }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        ...(color && { color }),
      }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <IconComponent className="w-full h-full" />
    </span>
  );
}
