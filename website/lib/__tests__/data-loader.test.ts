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

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  loadJsonFile,
  loadJsonFiles,
  loadJsonFileDirect,
} from "../data-loader";
import * as logger from "../logger";
import fs from "fs/promises";
import path from "path";

describe("data-loader", () => {
  describe("loadJsonFile", () => {
    it("应该成功加载存在的 JSON 文件", async () => {
      const data = await loadJsonFile(
        ["data", "characters"],
        "1547.json",
        "zh-CN"
      );

      expect(data).not.toBeNull();
      expect(data).toHaveProperty("id", "1547");
      expect(data).toHaveProperty("name");
    });

    it("应该在 locale 文件不存在时回退到默认 locale", async () => {
      const data = await loadJsonFile(
        ["data", "characters"],
        "1547.json",
        "non-existent-locale"
      );

      // 应该回退到 zh-CN
      expect(data).not.toBeNull();
      expect(data).toHaveProperty("id", "1547");
    });

    it("应该在文件不存在时返回 null", async () => {
      const data = await loadJsonFile(
        ["data", "characters"],
        "non-existent-file.json",
        "zh-CN"
      );

      expect(data).toBeNull();
    });

    it("应该支持自定义回退 locale", async () => {
      const data = await loadJsonFile(
        ["data", "characters"],
        "1547.json",
        "en",
        "en" // 自定义回退 locale
      );

      expect(data).not.toBeNull();
    });
  });

  describe("loadJsonFiles", () => {
    it("应该成功加载目录下的所有 JSON 文件", async () => {
      const data = await loadJsonFiles(["data", "characters"], "zh-CN");

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // 验证第一个项目的结构
      const firstItem = data[0];
      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("name");
    });

    it("应该在目录不存在时回退到默认 locale", async () => {
      const data = await loadJsonFiles(
        ["data", "characters"],
        "non-existent-locale"
      );

      // 应该回退到 zh-CN
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it("应该支持过滤函数", async () => {
      interface TestCharacter {
        id: string;
        tier?: string;
      }

      const data = await loadJsonFiles<TestCharacter>(
        ["data", "characters"],
        "zh-CN",
        {
          filter: (item) => item.id === "1547",
        }
      );

      expect(data.length).toBe(1);
      expect(data[0].id).toBe("1547");
    });

    it("应该在目录不存在时返回空数组", async () => {
      const data = await loadJsonFiles(
        ["data", "non-existent-directory"],
        "zh-CN"
      );

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });

  describe("loadJsonFiles - 错误处理", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("应该处理单个文件解析失败的情况", async () => {
      const errorSpy = vi
        .spyOn(logger.logger, "error")
        .mockImplementation(() => {});

      // Mock readdir 返回两个文件
      vi.spyOn(fs, "readdir").mockResolvedValue([
        "valid.json",
        "invalid.json",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      // Mock readFile：让一个文件的 JSON.parse 失败
      const originalReadFile = fs.readFile;
      vi.spyOn(fs, "readFile").mockImplementation(async (filePath) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("invalid.json")) {
          // 返回无效的 JSON 字符串，这会导致 JSON.parse 失败
          return "{ this is not valid json" as unknown as Buffer;
        }
        // 对于其他文件，调用原始的 readFile
        return originalReadFile.call(fs, filePath, "utf-8");
      });

      const data = await loadJsonFiles(["data", "characters"], "zh-CN");

      // 验证 logger.error 被调用（因为 invalid.json 解析失败）
      expect(errorSpy).toHaveBeenCalled();

      // 清理
      vi.restoreAllMocks();
    });
  });

  describe("loadJsonFileDirect", () => {
    it("应该成功加载指定路径的 JSON 文件", async () => {
      const data = await loadJsonFileDirect([
        "data",
        "characters",
        "zh-CN",
        "1547.json",
      ]);

      expect(data).not.toBeNull();
      expect(data).toHaveProperty("id", "1547");
    });

    it("应该在文件不存在时返回 null", async () => {
      const data = await loadJsonFileDirect([
        "data",
        "characters",
        "zh-CN",
        "non-existent.json",
      ]);

      expect(data).toBeNull();
    });
  });
});
