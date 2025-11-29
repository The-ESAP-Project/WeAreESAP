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

/**
 * 项目支柱定义
 */
export interface Pillar {
  id: string;
  title: string;
  character: string;
  color: {
    primary: string;
    dark: string;
  };
  icon: string;
  traits: string[];
  quote: string;
}

/**
 * 核心价值观定义
 */
export interface Value {
  title: string;
  quote: string;
  description: string;
  icon: string;
}

/**
 * 技术基石定义
 */
export interface Technology {
  name: string;
  description: string;
  features: string[];
}

/**
 * 时间线项目定义
 */
export interface TimelineItem {
  year: string;
  event: string;
}

/**
 * 参与方式定义
 */
export interface Participation {
  role: string;
  activities: string[];
}

/**
 * 意义章节定义
 */
export interface MeaningSection {
  title: string;
  points: string[];
}

/**
 * 项目完整数据结构
 */
export interface ProjectData {
  hero: {
    title: string;
    subtitle: string;
    quote: string;
    description: string;
  };
  pillars: Pillar[];
  coreValues: Value[];
  worldview: {
    tech: Technology[];
    timeline: TimelineItem[];
  };
  participation: Participation[];
  meaning: {
    forCreators: MeaningSection;
    forParticipants: MeaningSection;
    forWorld: MeaningSection;
  };
  triangleSymbol: {
    title: string;
    description: string;
    meanings: string[];
  };
}
