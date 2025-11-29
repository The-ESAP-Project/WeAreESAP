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
 * 激进优化大图片文件
 * - 降低 WebP 质量到 80
 * - 限制最大宽度为 1920px（保持宽高比）
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, "../public/images/characters");
const LARGE_IMAGES = ["img_1543.webp", "img_1549.webp", "img_1548.webp"];

const MAX_WIDTH = 1920; // 限制最大宽度
const WEBP_QUALITY = 80; // 较低的质量

async function optimizeImage(filename) {
  const inputPath = path.join(IMAGE_DIR, filename);

  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // 计算新尺寸（如果需要）
    let newWidth = width;
    let newHeight = height;
    if (width > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
      newHeight = Math.round((height * MAX_WIDTH) / width);
    }

    // 优化图片
    const sharpInstance = sharp(inputPath);

    if (width > MAX_WIDTH) {
      sharpInstance.resize(newWidth, newHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    await sharpInstance
      .webp({
        quality: WEBP_QUALITY,
        effort: 6,
      })
      .toFile(inputPath + ".tmp");

    await fs.rename(inputPath + ".tmp", inputPath);

    const newStats = await fs.stat(inputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize) * 100;

    console.log(`  ✅ ${filename}`);
    console.log(
      `     原始: ${(originalSize / 1024).toFixed(2)} KB → 优化后: ${(newSize / 1024).toFixed(2)} KB`
    );
    console.log(`     减少: ${reduction.toFixed(1)}%`);
    console.log(`     尺寸: ${width}x${height} → ${newWidth}x${newHeight}`);
    console.log();

    return {
      filename,
      originalSize,
      newSize,
      reduction,
    };
  } catch (error) {
    console.error(`  ❌ ${filename} 优化失败:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🎨 开始激进优化大图片...\n");
  console.log(`⚙️  配置: 质量=${WEBP_QUALITY}, 最大宽度=${MAX_WIDTH}px\n`);

  const results = [];

  for (const filename of LARGE_IMAGES) {
    const result = await optimizeImage(filename);
    if (result) {
      results.push(result);
    }
  }

  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalReduction = ((totalOriginal - totalNew) / totalOriginal) * 100;

    console.log("✨ 优化完成！");
    console.log(`   总原始大小: ${(totalOriginal / 1024).toFixed(2)} KB`);
    console.log(`   总优化后: ${(totalNew / 1024).toFixed(2)} KB`);
    console.log(`   总节省: ${totalReduction.toFixed(1)}%\n`);
  }
}

main().catch((error) => {
  console.error("❌ 优化过程出错:", error);
  process.exit(1);
});
