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

/**
 * 生成图片的模糊占位符 (blur placeholder)
 * 使用 plaiceholder 为所有角色图片生成 base64 编码的模糊预览
 */

import { getPlaiceholder } from "plaiceholder";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBlurPlaceholders() {
  console.log("🎨 开始生成模糊占位符...\n");

  // 需要扫描的图片目录（相对于 public/）
  const imageDirs = ["assets/images/characters", "assets/images/avatar", "assets/images/organizations"];
  const publicDir = path.join(__dirname, "../public");
  const outputFile = path.join(__dirname, "../data/blur-placeholders.json");

  const IMAGE_EXTS = new Set([".webp", ".jpg", ".png"]);

  /**
   * 递归收集目录下所有图片文件
   * @returns {{ relativePath: string, absolutePath: string }[]}
   */
  async function collectImages(dir, baseDir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await collectImages(fullPath, baseDir));
      } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
        results.push({
          relativePath: path.relative(publicDir, fullPath).split(path.sep).join("/"),
          absolutePath: fullPath,
          filename: path.relative(baseDir, fullPath).split(path.sep).join("/"),
        });
      }
    }
    return results;
  }

  try {
    const blurDataMap = {};
    let totalFiles = 0;
    let processedCount = 0;

    for (const imageDir of imageDirs) {
      const fullDir = path.join(publicDir, imageDir);

      // 跳过不存在的目录
      try {
        await fs.access(fullDir);
      } catch {
        continue;
      }

      const imageFiles = await collectImages(fullDir, fullDir);

      if (imageFiles.length === 0) continue;

      totalFiles += imageFiles.length;
      console.log(`📂 ${imageDir}/ 找到 ${imageFiles.length} 个图片文件\n`);

      const results = await Promise.allSettled(
        imageFiles.map(async ({ relativePath, absolutePath, filename }) => {
          const buffer = await fs.readFile(absolutePath);
          const { base64 } = await getPlaiceholder(buffer, { size: 20 });
          return { key: relativePath, filename, base64 };
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          const { key, filename, base64 } = result.value;
          blurDataMap[key] = base64;
          processedCount++;

          const sizeKB = (base64.length / 1024).toFixed(2);
          console.log(`  ✅ ${filename.padEnd(25)} → ${sizeKB} KB`);
        } else {
          const idx = results.indexOf(result);
          const file = imageFiles[idx]?.filename || "unknown";
          console.error(
            `  ❌ 处理失败: ${file}`,
            result.reason?.message || result.reason
          );
        }
      }

      console.log("");
    }

    if (totalFiles === 0) {
      console.log("⚠️  未找到图片文件");
      return;
    }

    // 保存到 JSON 文件
    await fs.writeFile(
      outputFile,
      JSON.stringify(blurDataMap, null, 2),
      "utf-8"
    );

    console.log(`✨ 完成！`);
    console.log(`   已生成: ${processedCount}/${totalFiles} 个占位符`);
    console.log(`   保存至: ${path.relative(process.cwd(), outputFile)}\n`);
  } catch (error) {
    console.error("❌ 生成失败:", error);
    process.exit(1);
  }
}

// 运行脚本
generateBlurPlaceholders();
