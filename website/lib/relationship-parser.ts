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
 * 关系数据服务端读取（仅服务端使用）
 * 包含文件系统操作，不能在客户端导入
 */

import fs from "fs/promises";
import path from "path";
import { Relationship, CharacterRelationshipData } from "@/types/relationship";
import { logger } from "./logger";

/**
 * 验证关系数据结构
 */
function validateRelationshipData(
  data: unknown
): data is CharacterRelationshipData {
  if (!data || typeof data !== "object") {
    return false;
  }

  const typed = data as Partial<CharacterRelationshipData>;

  // 检查必要字段
  if (!typed.characterId || typeof typed.characterId !== "string") {
    return false;
  }

  if (!Array.isArray(typed.relationships)) {
    return false;
  }

  // 验证每个关系项
  return typed.relationships.every((rel) => {
    return (
      rel &&
      typeof rel === "object" &&
      typeof rel.targetId === "string" &&
      typeof rel.type === "string" &&
      typeof rel.label === "string" &&
      typeof rel.description === "string"
    );
  });
}

/**
 * 服务端：读取角色关系数据文件
 * @param characterId 角色 ID
 * @returns 关系数据，如果文件不存在返回空数组
 */
export async function getCharacterRelationships(
  characterId: string
): Promise<Relationship[]> {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "characters",
      "relations",
      `${characterId}.json`
    );

    const fileContent = await fs.readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(fileContent);

    // 验证数据结构
    if (!validateRelationshipData(data)) {
      logger.warn(`关系数据文件 ${characterId}.json 格式不正确，已跳过`);
      return [];
    }

    return data.relationships;
  } catch (error) {
    // 文件不存在或解析失败，返回空数组
    logger.log(
      `关系数据文件 ${characterId}.json 不存在或解析失败`,
      error instanceof Error ? error.message : ""
    );
    return [];
  }
}
