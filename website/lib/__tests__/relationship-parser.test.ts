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
import { getCharacterRelationships } from "../relationship-parser";
import * as logger from "../logger";
import fs from "fs/promises";

describe("relationship-parser", () => {
  describe("getCharacterRelationships", () => {
    it("应该成功加载存在的关系数据", async () => {
      const relationships = await getCharacterRelationships("1547");

      expect(Array.isArray(relationships)).toBe(true);
      expect(relationships.length).toBeGreaterThan(0);

      // 验证第一个关系的结构
      const firstRel = relationships[0];
      expect(firstRel).toHaveProperty("targetId");
      expect(firstRel).toHaveProperty("type");
      expect(firstRel).toHaveProperty("label");
      expect(firstRel).toHaveProperty("description");
    });

    it("应该返回正确的关系类型", async () => {
      const relationships = await getCharacterRelationships("1547");

      // 检查是否有创造者关系
      const creatorRel = relationships.find((r) => r.type === "creator");
      expect(creatorRel).toBeDefined();
      expect(creatorRel?.targetId).toBe("1548");
    });

    it("应该在文件不存在时返回空数组", async () => {
      const relationships = await getCharacterRelationships("non-existent");

      expect(Array.isArray(relationships)).toBe(true);
      expect(relationships.length).toBe(0);
    });

    it("应该验证所有关系项都有必需字段", async () => {
      const relationships = await getCharacterRelationships("1547");

      relationships.forEach((rel) => {
        expect(rel.targetId).toBeTruthy();
        expect(rel.type).toBeTruthy();
        expect(rel.label).toBeTruthy();
        expect(rel.description).toBeTruthy();
      });
    });
  });

  describe("数据验证", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("应该处理 null 数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue("null");

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理非对象类型数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue('"string data"');

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理缺少 characterId 的数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue(
        JSON.stringify({
          relationships: [],
        })
      );

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理 characterId 类型错误的数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue(
        JSON.stringify({
          characterId: 12345,
          relationships: [],
        })
      );

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理 relationships 不是数组的数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue(
        JSON.stringify({
          characterId: "1547",
          relationships: "not an array",
        })
      );

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理 relationships 数组中包含无效项的数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue(
        JSON.stringify({
          characterId: "1547",
          relationships: [
            {
              targetId: "1548",
              type: "friend",
              label: "朋友",
              // 缺少 description
            },
          ],
        })
      );

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理空对象数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue("{}");

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });

    it("应该处理 relationships 中有 null 项的数据", async () => {
      const warnSpy = vi.spyOn(logger.logger, "warn");
      vi.spyOn(fs, "readFile").mockResolvedValue(
        JSON.stringify({
          characterId: "1547",
          relationships: [null],
        })
      );

      const relationships = await getCharacterRelationships("invalid");

      expect(relationships).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "关系数据文件 invalid.json 格式不正确，已跳过"
      );
    });
  });
});
