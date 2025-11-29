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
 * 统一的数据加载工具
 * 提供带 locale 回退的 JSON 文件读取功能
 */

import fs from "fs/promises";
import path from "path";
import { logger } from "./logger";

/**
 * 检查路径是否存在
 */
async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 加载单个 JSON 文件，支持 locale 回退
 * @param basePath 基础路径数组，如 ['data', 'characters']
 * @param filename 文件名（可以包含子路径），如 'zh-CN/1547.json' 或 '1547.json'
 * @param locale 当前语言
 * @param fallbackLocale 回退语言，默认为 'zh-CN'
 * @returns 解析后的 JSON 数据，失败返回 null
 *
 * @example
 * ```ts
 * const character = await loadJsonFile<Character>(
 *   ['data', 'characters'],
 *   '1547.json',
 *   'en'
 * );
 * ```
 */
export async function loadJsonFile<T>(
  basePath: string[],
  filename: string,
  locale: string,
  fallbackLocale = "zh-CN"
): Promise<T | null> {
  try {
    // 尝试当前 locale 的文件
    let filePath = path.join(process.cwd(), ...basePath, locale, filename);

    // 如果不存在，尝试回退到 fallbackLocale
    if (!(await exists(filePath))) {
      logger.warn(
        `文件 ${path.join(locale, filename)} 不存在，回退到 ${fallbackLocale}`
      );
      filePath = path.join(
        process.cwd(),
        ...basePath,
        fallbackLocale,
        filename
      );
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    logger.error(`加载或解析文件失败 ${filename}:`, error);
    return null;
  }
}

/**
 * 加载目录下的所有 JSON 文件，支持 locale 回退
 * @param basePath 基础路径数组，如 ['data', 'characters']
 * @param locale 当前语言
 * @param options 可选配置
 * @param options.fallbackLocale 回退语言，默认为 'zh-CN'
 * @param options.filter 可选的过滤函数，用于筛选文件
 * @returns 解析后的 JSON 数据数组
 *
 * @example
 * ```ts
 * // 基础用法
 * const characters = await loadJsonFiles<CharacterCardData>(
 *   ['data', 'characters'],
 *   'en'
 * );
 *
 * // 带过滤器
 * const coreCharacters = await loadJsonFiles<CharacterCardData>(
 *   ['data', 'characters'],
 *   'en',
 *   { filter: (c) => c.tier === 'core' }
 * );
 * ```
 */
export async function loadJsonFiles<T>(
  basePath: string[],
  locale: string,
  options: {
    fallbackLocale?: string;
    filter?: (item: T) => boolean;
  } = {}
): Promise<T[]> {
  const { fallbackLocale = "zh-CN", filter } = options;

  try {
    // 尝试当前 locale 的目录
    let dirPath = path.join(process.cwd(), ...basePath, locale);

    // 如果目录不存在，回退到 fallbackLocale
    if (!(await exists(dirPath))) {
      logger.warn(`目录 ${locale} 不存在，回退到 ${fallbackLocale}`);
      dirPath = path.join(process.cwd(), ...basePath, fallbackLocale);
    }

    const files = await fs.readdir(dirPath);

    // 并行读取和解析所有 JSON 文件
    const jsonFilePromises = files
      .filter((file) => file.endsWith(".json"))
      .map(async (file): Promise<T | null> => {
        const filePath = path.join(dirPath, file);
        try {
          const fileContent = await fs.readFile(filePath, "utf-8");
          return JSON.parse(fileContent) as T;
        } catch (error) {
          logger.error(`加载或解析文件失败 ${filePath}:`, error);
          return null;
        }
      });

    // 等待所有文件加载完成，过滤掉失败的文件
    const allItems = (await Promise.all(jsonFilePromises)) as (T | null)[];
    const items = allItems.filter((item): item is T => item !== null);

    // 如果提供了过滤函数，应用过滤
    return filter ? items.filter(filter) : items;
  } catch (error) {
    logger.error(`加载目录文件失败 ${basePath.join("/")}:`, error);
    return [];
  }
}

/**
 * 加载单个 JSON 文件（不带 locale，直接路径）
 * @param filePath 文件路径数组，如 ['data', 'project', 'en', 'overview.json']
 * @returns 解析后的 JSON 数据，失败返回 null
 *
 * @example
 * ```ts
 * const data = await loadJsonFileDirect<ProjectData>(
 *   ['data', 'project', locale, 'overview.json']
 * );
 * ```
 */
export async function loadJsonFileDirect<T>(
  filePath: string[]
): Promise<T | null> {
  try {
    const fullPath = path.join(process.cwd(), ...filePath);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    logger.error(`加载或解析文件失败 ${filePath.join("/")}:`, error);
    return null;
  }
}
