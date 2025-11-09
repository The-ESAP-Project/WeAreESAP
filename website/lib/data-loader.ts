// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

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
    logger.error(`加载文件失败 ${filename}:`, error);
    return null;
  }
}

/**
 * 加载目录下的所有 JSON 文件，支持 locale 回退
 * @param basePath 基础路径数组，如 ['data', 'characters']
 * @param locale 当前语言
 * @param fallbackLocale 回退语言，默认为 'zh-CN'
 * @param filter 可选的过滤函数，用于筛选文件
 * @returns 解析后的 JSON 数据数组
 *
 * @example
 * ```ts
 * const characters = await loadJsonFiles<CharacterCardData>(
 *   ['data', 'characters'],
 *   'en'
 * );
 * ```
 */
export async function loadJsonFiles<T>(
  basePath: string[],
  locale: string,
  fallbackLocale = "zh-CN",
  filter?: (item: T) => boolean
): Promise<T[]> {
  try {
    // 尝试当前 locale 的目录
    let dirPath = path.join(process.cwd(), ...basePath, locale);

    // 如果目录不存在，回退到 fallbackLocale
    if (!(await exists(dirPath))) {
      logger.log(`目录 ${locale} 不存在，回退到 ${fallbackLocale}`);
      dirPath = path.join(process.cwd(), ...basePath, fallbackLocale);
    }

    const files = await fs.readdir(dirPath);
    const items: T[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(dirPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const item = JSON.parse(fileContent) as T;
        items.push(item);
      }
    }

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
    logger.error(`加载文件失败 ${filePath.join("/")}:`, error);
    return null;
  }
}
