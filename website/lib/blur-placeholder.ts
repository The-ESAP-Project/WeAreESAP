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
 * 获取图片的模糊占位符 (blur placeholder)
 */

import blurData from "@/data/blur-placeholders.json";

/**
 * 根据图片路径获取对应的 blur data URL
 * @param imagePath - 图片路径，例如 "/images/characters/img_1549.webp"
 * @returns blur data URL 或 undefined
 */
export function getBlurDataURL(imagePath: string): string | undefined {
  // 提取文件名
  const filename = imagePath.split("/").pop();
  if (!filename) return undefined;

  // 从 JSON 中获取对应的 blur data
  return blurData[filename as keyof typeof blurData];
}

/**
 * 检查图片是否有 blur placeholder
 * @param imagePath - 图片路径
 * @returns 是否存在 blur data
 */
export function hasBlurData(imagePath: string): boolean {
  return getBlurDataURL(imagePath) !== undefined;
}
