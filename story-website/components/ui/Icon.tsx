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

import type { ComponentType } from "react";
import {
  LuArrowLeft,
  LuBookOpen,
  LuCheck,
  LuChevronDown,
  LuChevronRight,
  LuChevronUp,
  LuCopy,
  LuEye,
  LuGlobe,
  LuLock,
  LuLockOpen,
  LuMenu,
  LuMessageCircle,
  LuMoon,
  LuRss,
  LuSearch,
  LuSettings,
  LuSun,
  LuX,
} from "react-icons/lu";
import { SiDiscord, SiGithub } from "react-icons/si";

export type IconName =
  | "ArrowLeft"
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
  | "Rss"
  | "Copy"
  | "Check"
  | "ChevronDown"
  | "ChevronRight"
  | "ChevronUp";

const iconMap: Record<IconName, ComponentType<{ className?: string }>> = {
  ArrowLeft: LuArrowLeft,
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
  Rss: LuRss,
  Copy: LuCopy,
  Check: LuCheck,
  ChevronDown: LuChevronDown,
  ChevronRight: LuChevronRight,
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
