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

describe("logger", () => {
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // 保存原始 NODE_ENV
    originalNodeEnv = process.env.NODE_ENV;

    // Mock console 方法
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    // 恢复原始 NODE_ENV
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe("开发环境", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      vi.resetModules();
    });

    it("应该在开发环境下调用 console.log", async () => {
      const { logger } = await import("../logger");

      logger.log("测试消息", 123);

      expect(console.log).toHaveBeenCalledWith("测试消息", 123);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("应该在开发环境下调用 console.info", async () => {
      const { logger } = await import("../logger");

      logger.info("信息消息");

      expect(console.info).toHaveBeenCalledWith("信息消息");
      expect(console.info).toHaveBeenCalledTimes(1);
    });

    it("应该在开发环境下调用 console.warn", async () => {
      const { logger } = await import("../logger");

      logger.warn("警告消息");

      expect(console.warn).toHaveBeenCalledWith("警告消息");
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("应该在开发环境下调用 console.error", async () => {
      const { logger } = await import("../logger");

      logger.error("错误消息", new Error("测试错误"));

      expect(console.error).toHaveBeenCalledWith("错误消息", expect.any(Error));
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it("应该在开发环境下调用 console.debug", async () => {
      const { logger } = await import("../logger");

      logger.debug("调试消息", { data: "test" });

      expect(console.debug).toHaveBeenCalledWith("调试消息", { data: "test" });
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it("应该正确传递多个参数", async () => {
      const { logger } = await import("../logger");

      logger.log("消息1", "消息2", 123, { key: "value" }, [1, 2, 3]);

      expect(console.log).toHaveBeenCalledWith(
        "消息1",
        "消息2",
        123,
        { key: "value" },
        [1, 2, 3]
      );
    });
  });

  describe("生产环境", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      vi.resetModules();
    });

    it("应该在生产环境下不调用 console.log", async () => {
      const { logger } = await import("../logger");

      logger.log("测试消息");

      expect(console.log).not.toHaveBeenCalled();
    });

    it("应该在生产环境下不调用 console.info", async () => {
      const { logger } = await import("../logger");

      logger.info("信息消息");

      expect(console.info).not.toHaveBeenCalled();
    });

    it("应该在生产环境下不调用 console.warn", async () => {
      const { logger } = await import("../logger");

      logger.warn("警告消息");

      expect(console.warn).not.toHaveBeenCalled();
    });

    it("应该在生产环境下不调用 console.error", async () => {
      const { logger } = await import("../logger");

      logger.error("错误消息");

      expect(console.error).not.toHaveBeenCalled();
    });

    it("应该在生产环境下不调用 console.debug", async () => {
      const { logger } = await import("../logger");

      logger.debug("调试消息");

      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe("其他环境", () => {
    it("应该在测试环境下不调用 console", async () => {
      process.env.NODE_ENV = "test";
      vi.resetModules();

      const { logger } = await import("../logger");

      logger.log("测试消息");
      logger.info("信息消息");
      logger.warn("警告消息");
      logger.error("错误消息");
      logger.debug("调试消息");

      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });

    it("应该在未设置 NODE_ENV 时不调用 console", async () => {
      delete process.env.NODE_ENV;
      vi.resetModules();

      const { logger } = await import("../logger");

      logger.log("测试消息");

      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
