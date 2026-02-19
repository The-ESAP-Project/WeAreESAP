#!/usr/bin/env node
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

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取版本号（从 package.json）
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

try {
  // 获取 git 最新提交时间
  const gitDate = execSync("git log -1 --format=%cd --date=format:%Y-%m-%d", {
    encoding: "utf-8",
  }).trim();

  const buildInfo = {
    version: packageJson.version,
    lastUpdated: gitDate,
    buildTime: new Date().toISOString().split("T")[0],
  };

  // 写入到 data 目录（作为 TypeScript 可导入的文件）
  const outputPath = join(__dirname, "..", "data", "build-info.json");
  writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

  console.log("✨ 构建信息已生成:", buildInfo);
} catch (error) {
  console.error("⚠️  无法生成构建信息，使用默认值", error.message);

  // 降级方案：使用当前时间和 package.json 版本
  const fallbackInfo = {
    version: packageJson.version,
    lastUpdated: new Date().toISOString().split("T")[0],
    buildTime: new Date().toISOString().split("T")[0],
  };

  const outputPath = join(__dirname, "..", "data", "build-info.json");
  writeFileSync(outputPath, JSON.stringify(fallbackInfo, null, 2));

  console.log("✨ 使用降级构建信息:", fallbackInfo);
}
