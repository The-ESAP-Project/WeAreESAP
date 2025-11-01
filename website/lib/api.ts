/**
 * API 调用封装
 * 客户端组件使用的 API 调用函数
 */

import {
  Character,
  CharactersResponse,
  CharacterResponse,
} from "@/types/character";

/**
 * 获取所有角色列表
 */
export async function getCharacters(): Promise<Character[]> {
  try {
    const response = await fetch("/api/characters");
    if (!response.ok) {
      throw new Error("获取角色列表失败");
    }
    const data: CharactersResponse = await response.json();
    return data.characters;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

/**
 * 根据 ID 获取单个角色详情
 * @param id 角色 ID
 */
export async function getCharacterById(
  id: string
): Promise<Character | null> {
  try {
    const response = await fetch(`/api/characters/${id}`);
    if (!response.ok) {
      throw new Error(`获取角色 ${id} 失败`);
    }
    const data: CharacterResponse = await response.json();
    return data.character;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

/**
 * 客户端缓存的角色数据
 * 可以在这里添加更多的缓存逻辑
 */
let cachedCharacters: Character[] | null = null;

/**
 * 获取角色列表（带缓存）
 */
export async function getCachedCharacters(): Promise<Character[]> {
  if (cachedCharacters) {
    return cachedCharacters;
  }
  cachedCharacters = await getCharacters();
  return cachedCharacters;
}

/**
 * 清除角色缓存
 */
export function clearCharactersCache(): void {
  cachedCharacters = null;
}
