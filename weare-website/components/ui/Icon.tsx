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
  // Heroicons
  HiCheckCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXCircle,
} from "react-icons/hi2";
import {
  LuAtom,
  LuBook,
  LuBookMarked,
  LuBookOpen,
  LuBrain,
  LuChartBar,
  LuChevronDown,
  LuCircle,
  LuCode,
  LuCoffee,
  LuCog,
  LuCpu,
  LuDroplet,
  LuEye,
  LuFileText,
  // Lucide Icons
  LuGlobe,
  LuHand,
  LuHeartHandshake,
  LuLink,
  LuLock,
  LuMenu,
  LuMessageCircle,
  LuMessageSquare,
  LuMoon,
  LuMusic,
  LuPalette,
  LuPenTool,
  LuRadio,
  LuSearch,
  LuSettings,
  LuShield,
  LuSparkles,
  LuStar,
  LuSun,
  LuTarget,
  LuUsers,
  LuX,
  LuZap,
} from "react-icons/lu";
import {
  SiDiscord,
  // Simple Icons
  SiGithub,
} from "react-icons/si";
import { logger } from "@/lib/logger";

// 图标类型
export type IconName =
  // 平台图标
  | "Globe"
  | "Github"
  | "Discord"
  | "MessageCircle"
  | "Users"
  // 状态图标
  | "CheckCircle"
  | "XCircle"
  | "InfoCircle"
  | "Warning"
  // 功能图标
  | "Target"
  | "BookOpen"
  | "Music"
  | "MessageSquare"
  | "Settings"
  | "PenTool"
  | "Code"
  | "Hand"
  | "BookMarked"
  | "Palette"
  | "Star"
  | "Sparkles"
  | "Link"
  | "FileText"
  | "Cog"
  // 新增图标
  | "Brain"
  | "Book"
  | "HeartHandshake"
  | "Zap"
  | "Circle"
  | "BarChart"
  // 技术设定图标
  | "Cpu"
  | "Radio"
  | "Atom"
  | "Droplet"
  // 导航图标
  | "Menu"
  | "X"
  // 搜索图标
  | "Search"
  // 主题图标
  | "Sun"
  | "Moon"
  // 组织设定图标
  | "Shield"
  | "Lock"
  | "Eye"
  | "Coffee"
  // 交互图标
  | "ChevronDown";

// 图标映射表
const iconMap: Record<IconName, ComponentType<{ className?: string }>> = {
  // 平台图标 (Lucide + Simple Icons)
  Globe: LuGlobe,
  Github: SiGithub,
  Discord: SiDiscord,
  MessageCircle: LuMessageCircle,
  Users: LuUsers,

  // 状态图标 (Heroicons)
  CheckCircle: HiCheckCircle,
  XCircle: HiXCircle,
  InfoCircle: HiInformationCircle,
  Warning: HiExclamationTriangle,

  // 功能图标 (Lucide)
  Target: LuTarget,
  BookOpen: LuBookOpen,
  Music: LuMusic,
  MessageSquare: LuMessageSquare,
  Settings: LuSettings,
  PenTool: LuPenTool,
  Code: LuCode,
  Hand: LuHand,
  BookMarked: LuBookMarked,
  Palette: LuPalette,
  Star: LuStar,
  Sparkles: LuSparkles,
  Link: LuLink,
  FileText: LuFileText,
  Cog: LuCog,

  // 新增图标 (Lucide)
  Brain: LuBrain,
  Book: LuBook,
  HeartHandshake: LuHeartHandshake,
  Zap: LuZap,
  Circle: LuCircle,
  BarChart: LuChartBar,

  // 技术设定图标 (Lucide)
  Cpu: LuCpu,
  Radio: LuRadio,
  Atom: LuAtom,
  Droplet: LuDroplet,

  // 导航图标 (Lucide)
  Menu: LuMenu,
  X: LuX,

  // 搜索图标 (Lucide)
  Search: LuSearch,

  // 主题图标 (Lucide)
  Sun: LuSun,
  Moon: LuMoon,

  // 组织设定图标 (Lucide)
  Shield: LuShield,
  Lock: LuLock,
  Eye: LuEye,
  Coffee: LuCoffee,

  // 交互图标
  ChevronDown: LuChevronDown,
};

export interface IconProps {
  /** 图标名称 */
  name: IconName;
  /** 图标大小（像素） */
  size?: number;
  /** 图标颜色 */
  color?: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 统一的图标组件
 *
 * 使用方式:
 * ```tsx
 * <Icon name="Globe" size={24} />
 * <Icon name="CheckCircle" className="text-green-500" />
 * ```
 */
export function Icon({ name, size = 20, color, className = "" }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    logger.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  // 合并样式：尺寸和颜色通过内联样式，其他通过 className
  const combinedClassName = className;
  const style: React.CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    ...(color && { color }),
  };

  return (
    <span style={style} className={combinedClassName}>
      <IconComponent className="w-full h-full" />
    </span>
  );
}

/**
 * 检查图标名称是否存在
 */
export function hasIcon(name: string): name is IconName {
  return name in iconMap;
}
