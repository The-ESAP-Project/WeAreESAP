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
 * 关系类型工具函数（客户端安全）
 * 只包含类型定义和颜色映射，不涉及文件系统操作
 */

import { RelationshipType } from "@/types/relationship";

/**
 * 关系类型关键词和颜色映射
 */
const RELATIONSHIP_CONFIG: Record<
  RelationshipType,
  { color: string; keywords: string[] }
> = {
  creator: {
    color: "#a855f7", // 紫色 - 创造力
    keywords: ["创造", "创建", "制造", "组装"],
  },
  family: {
    color: "#ef4444", // 红色 - 亲密
    keywords: ["家人", "亲人", "父母", "子女", "恋人", "爱人"],
  },
  work: {
    color: "#3b82f6", // 蓝色 - 专业
    keywords: ["同事", "合作", "协作", "共同", "项目", "工作"],
  },
  friend: {
    color: "#10b981", // 绿色 - 友谊
    keywords: ["朋友", "伙伴", "同好", "平等"],
  },
  mentor: {
    color: "#f59e0b", // 橙色 - 指导
    keywords: ["导师", "指导", "教导", "学习", "传授"],
  },
  rival: {
    color: "#f97316", // 深橙色 - 对抗
    keywords: ["对立", "竞争", "逆反", "矛盾", "敌对"],
  },
  unknown: {
    color: "#6b7280", // 灰色 - 未知
    keywords: [],
  },
};

/**
 * 获取关系类型的颜色
 */
export function getRelationshipColor(type: RelationshipType): string {
  return RELATIONSHIP_CONFIG[type]?.color || RELATIONSHIP_CONFIG.unknown.color;
}

/**
 * 获取所有关系类型配置（供 UI 使用）
 */
export function getAllRelationshipTypes() {
  return RELATIONSHIP_CONFIG;
}
