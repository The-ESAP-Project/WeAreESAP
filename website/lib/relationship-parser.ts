// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

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
