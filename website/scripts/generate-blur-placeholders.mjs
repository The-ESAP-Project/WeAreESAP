// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

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

  const imagesDir = path.join(__dirname, "../public/images/characters");
  const outputFile = path.join(__dirname, "../data/blur-placeholders.json");

  try {
    // 读取图片目录
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(
      (file) => file.endsWith(".webp") || file.endsWith(".jpg") || file.endsWith(".png")
    );

    if (imageFiles.length === 0) {
      console.log("⚠️  未找到图片文件");
      return;
    }

    console.log(`📂 找到 ${imageFiles.length} 个图片文件\n`);

    const blurDataMap = {};
    let processedCount = 0;

    // 为每个图片生成 blur data
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const buffer = await fs.readFile(filePath);

      try {
        // 生成 10x10 的模糊版本
        const { base64 } = await getPlaiceholder(buffer, { size: 20 });

        blurDataMap[file] = base64;
        processedCount++;

        const sizeKB = (base64.length / 1024).toFixed(2);
        console.log(`  ✅ ${file.padEnd(20)} → ${sizeKB} KB`);
      } catch (error) {
        console.error(`  ❌ 处理失败: ${file}`, error.message);
      }
    }

    // 保存到 JSON 文件
    await fs.writeFile(outputFile, JSON.stringify(blurDataMap, null, 2), "utf-8");

    console.log(`\n✨ 完成！`);
    console.log(`   已生成: ${processedCount}/${imageFiles.length} 个占位符`);
    console.log(`   保存至: ${path.relative(process.cwd(), outputFile)}\n`);
  } catch (error) {
    console.error("❌ 生成失败:", error);
    process.exit(1);
  }
}

// 运行脚本
generateBlurPlaceholders();
