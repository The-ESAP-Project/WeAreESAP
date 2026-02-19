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
 * 自动给源代码文件添加 SPDX 许可证头部
 *
 * 用法：
 *   node add-license-headers.js
 *
 * 或添加到 package.json scripts：
 *   "license:add": "node add-license-headers.js"
 */

const fs = require("fs");
const path = require("path");

// 许可证头部模板
const LICENSE_HEADERS = {
  // TypeScript/JavaScript 文件
  ts: `// Copyright 2025 The ESAP Project
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

`,

  // CSS 文件
  css: `/**
 * Copyright 2025 The ESAP Project
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

`,
};

// 需要处理的目录
const DIRECTORIES_TO_PROCESS = ["app", "components", "types", "lib"];

// 需要跳过的目录
const SKIP_DIRECTORIES = ["node_modules", ".next", "dist", "build", ".git"];

// 文件扩展名映射到许可证头部类型
const FILE_EXTENSIONS = {
  ".ts": "ts",
  ".tsx": "ts",
  ".js": "ts",
  ".jsx": "ts",
  ".css": "css",
};

// 检查文件是否已有许可证头部
function hasLicenseHeader(content) {
  return (
    content.includes("SPDX-License-Identifier") ||
    content.includes("Apache License")
  );
}

// 处理单个文件
function processFile(filePath) {
  const ext = path.extname(filePath);
  const headerType = FILE_EXTENSIONS[ext];

  if (!headerType) {
    return false; // 不支持的文件类型
  }

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // 检查是否已有许可证头部
    if (hasLicenseHeader(content)) {
      console.log(`  ⏭️  跳过（已有许可证）: ${filePath}`);
      return false;
    }

    // 添加许可证头部
    const header = LICENSE_HEADERS[headerType];
    content = header + content;

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✅ 已添加许可证: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ 处理失败: ${filePath}`, error.message);
    return false;
  }
}

// 递归遍历目录
function processDirectory(dirPath, stats = { added: 0, skipped: 0 }) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // 跳过特定目录
      if (SKIP_DIRECTORIES.includes(entry.name)) {
        continue;
      }
      processDirectory(fullPath, stats);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (FILE_EXTENSIONS[ext]) {
        const added = processFile(fullPath);
        if (added) {
          stats.added++;
        } else {
          stats.skipped++;
        }
      }
    }
  }

  return stats;
}

// 主函数
function main() {
  console.log("🔍 开始扫描并添加许可证头部...\n");

  const startTime = Date.now();
  const stats = { added: 0, skipped: 0 };

  for (const dir of DIRECTORIES_TO_PROCESS) {
    const dirPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  目录不存在，跳过: ${dir}`);
      continue;
    }

    console.log(`📂 处理目录: ${dir}`);
    processDirectory(dirPath, stats);
    console.log("");
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("✨ 完成！");
  console.log(`\n📊 统计:`);
  console.log(`   ✅ 已添加许可证: ${stats.added} 个文件`);
  console.log(`   ⏭️  已跳过: ${stats.skipped} 个文件`);
  console.log(`   ⏱️  用时: ${duration}s\n`);

  if (stats.added > 0) {
    console.log("💡 提示: 请检查修改的文件，确保许可证头部位置正确。");
    console.log("   如需撤销，可使用 git 恢复文件。\n");
  }
}

// 运行脚本
main();
