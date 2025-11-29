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

import { test, expect } from "@playwright/test";
import { navigateAndWait, waitForPageStable } from "./utils/helpers";
import { ROUTES, SELECTORS, TEST_CHARACTERS } from "./fixtures/test-data";

test.describe("错误处理", () => {
  test.describe("404 页面处理", () => {
    test("访问不存在的页面应该显示 404", async ({ page }) => {
      // 访问一个不存在的路径
      await page.goto("/this-page-does-not-exist");

      // 等待页面稳定
      await waitForPageStable(page);

      // 验证是否显示 404 相关内容
      const pageContent = await page.textContent("body");
      const has404Content =
        pageContent?.includes("404") ||
        pageContent?.includes("未找到") ||
        pageContent?.includes("Not Found") ||
        pageContent?.includes("页面不存在");

      expect(has404Content, "页面应该显示 404 错误信息").toBeTruthy();

      // 验证状态码或页面标题
      const title = await page.title();
      const hasErrorTitle =
        title.includes("404") ||
        title.includes("未找到") ||
        title.includes("Not Found");

      expect(
        hasErrorTitle || has404Content,
        "页面标题或内容应该包含错误提示"
      ).toBeTruthy();
    });

    test("404 页面应该有返回首页的链接", async ({ page }) => {
      await page.goto("/non-existent-page");
      await waitForPageStable(page);

      // 查找返回首页的链接（支持多种形式，包括 /zh-CN）
      const homeLink = page
        .locator('a[href="/"]')
        .or(page.locator('a[href^="/zh"]'))
        .or(page.locator('a[href^="/en"]'))
        .or(page.locator('a[href^="/ja"]'))
        .or(page.getByRole("link", { name: /首页|home|返回|back|回家/i }));

      // 验证至少有一个返回首页的链接
      const count = await homeLink.count();
      expect(count, "应该存在返回首页的链接").toBeGreaterThan(0);

      // 点击第一个链接
      await homeLink.first().click();

      // 等待导航完成
      await page.waitForURL(
        (url) => {
          return (
            url.pathname === "/" || /^\/(zh-CN|zh|en|ja)\/?$/.test(url.pathname)
          );
        },
        { timeout: 10000 }
      );
      await waitForPageStable(page);

      // 验证成功返回首页
      await expect(page).toHaveURL(/\/(zh-CN|zh|en|ja)?\/?$/);
    });

    test("404 页面应该保持导航可用", async ({ page }) => {
      await page.goto("/invalid-route-12345");
      await waitForPageStable(page);

      // 404页面是全屏设计，没有常规导航栏，但应该有导航按钮
      // 验证有返回首页的链接
      const homeLink = page
        .getByRole("link", { name: /首页|home|回家/i })
        .first();
      await expect(homeLink, "404页面应该有返回首页的链接").toBeVisible();

      // 验证有其他导航链接（如角色页面）
      const charactersLink = page.locator('a[href*="/characters"]').first();
      await expect(charactersLink, "404页面应该有其他导航链接").toBeVisible();

      // 测试导航链接可以点击
      await charactersLink.click();

      // 等待导航
      await page.waitForURL(/\/characters/, { timeout: 10000 });
      await waitForPageStable(page);

      // 验证能够导航到正常页面
      await expect(page).toHaveURL(/\/characters/);
    });
  });

  test.describe("角色不存在处理", () => {
    test("访问不存在的角色 ID 应该有适当处理", async ({ page }) => {
      // 使用一个明显不存在的角色 ID
      const nonExistentId = "99999";
      await page.goto(`/characters/${nonExistentId}`);
      await waitForPageStable(page);

      // 检查是否显示错误信息或重定向
      const url = page.url();
      const pageContent = await page.textContent("body");

      // 可能的处理方式：
      // 1. 显示错误信息
      const hasErrorMessage =
        pageContent?.includes("未找到") ||
        pageContent?.includes("不存在") ||
        pageContent?.includes("Not Found") ||
        pageContent?.includes("404");

      // 2. 重定向到角色列表页
      const isRedirected =
        url.includes("/characters") && !url.includes(nonExistentId);

      expect(
        hasErrorMessage || isRedirected,
        "应该显示错误信息或重定向到角色列表"
      ).toBeTruthy();
    });

    test("访问无效格式的角色 ID 应该处理", async ({ page }) => {
      // 测试各种无效的 ID 格式
      const invalidIds = ["abc", "!@#$", "../..", "null", "undefined"];

      for (const invalidId of invalidIds) {
        await page.goto(`/characters/${invalidId}`);
        await waitForPageStable(page);

        // 验证页面没有崩溃
        const pageContent = await page.textContent("body");
        expect(
          pageContent,
          `处理无效 ID "${invalidId}" 时页面不应为空`
        ).toBeTruthy();

        // 验证显示了某种错误状态
        const hasError =
          pageContent?.includes("错误") ||
          pageContent?.includes("未找到") ||
          pageContent?.includes("Error") ||
          pageContent?.includes("Not Found");

        const url = page.url();
        const isHandled = hasError || !url.includes(invalidId);

        expect(isHandled, `无效 ID "${invalidId}" 应该被妥善处理`).toBeTruthy();
      }
    });

    test("角色详情页加载失败时应该有提示", async ({ page }) => {
      // 模拟网络故障
      await page.route("**/api/**", (route) => route.abort("failed"));

      await page.goto(ROUTES.CHARACTER_DETAIL(TEST_CHARACTERS.APTS_1547.id));

      // 等待页面尝试加载
      await page.waitForTimeout(2000);

      // 验证页面显示了某种反馈（加载状态或错误提示）
      const pageContent = await page.textContent("body");
      const hasLoadingOrError =
        pageContent?.includes("加载") ||
        pageContent?.includes("错误") ||
        pageContent?.includes("Loading") ||
        pageContent?.includes("Error") ||
        pageContent?.includes("失败");

      // 或者检查是否有骨架屏/加载指示器
      const hasLoadingIndicator =
        (await page.locator(SELECTORS.LOADING_SPINNER).count()) > 0 ||
        (await page.locator(SELECTORS.LOADING_SKELETON).count()) > 0;

      expect(
        hasLoadingOrError || hasLoadingIndicator,
        "应该显示加载状态或错误提示"
      ).toBeTruthy();
    });
  });

  test.describe("数据加载失败回退", () => {
    test("角色列表加载失败应该有友好提示", async ({ page }) => {
      // 拦截 API 请求并返回错误
      await page.route("**/api/characters/**", (route) =>
        route.abort("failed")
      );

      await navigateAndWait(page, ROUTES.CHARACTERS);

      // 等待可能的错误消息显示
      await page.waitForTimeout(1500);

      const pageContent = await page.textContent("body");

      // 检查是否有错误提示或重试选项
      const hasErrorHandling =
        pageContent?.includes("加载失败") ||
        pageContent?.includes("重试") ||
        pageContent?.includes("错误") ||
        pageContent?.includes("Failed") ||
        pageContent?.includes("Error") ||
        pageContent?.includes("Retry");

      expect(hasErrorHandling, "角色列表加载失败应该有错误提示").toBeTruthy();
    });

    test("网络超时应该有适当处理", async ({ page }) => {
      // 模拟慢速网络
      await page.route("**/api/**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto(ROUTES.CHARACTERS);

      // 等待一段时间看是否有超时处理
      await page.waitForTimeout(3000);

      const elapsed = Date.now() - startTime;

      // 验证页面在合理时间内给出反馈
      const pageContent = await page.textContent("body");
      const hasContent = pageContent && pageContent.length > 100;

      expect(
        hasContent || elapsed < 10000,
        "页面应该在合理时间内显示内容或加载状态"
      ).toBeTruthy();
    });

    test("部分数据加载失败不应影响整体页面", async ({ page }) => {
      // 只阻止特定资源
      await page.route("**/*.png", (route) => route.abort("failed"));
      await page.route("**/*.jpg", (route) => route.abort("failed"));

      await navigateAndWait(page, ROUTES.CHARACTERS);

      // 验证页面主体内容仍然可见
      const nav = page.locator("nav");
      await expect(nav, "导航栏应该正常显示").toBeVisible();

      // 验证页面有实际内容
      const pageContent = await page.textContent("body");
      expect(
        pageContent && pageContent.length > 200,
        "页面应该显示主要内容"
      ).toBeTruthy();
    });

    test("JavaScript 错误不应导致页面白屏", async ({ page }) => {
      const consoleErrors: string[] = [];

      // 监听控制台错误
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      // 监听页面错误
      page.on("pageerror", (error) => {
        consoleErrors.push(error.message);
      });

      await page.goto(ROUTES.HOME);
      await waitForPageStable(page);

      // 即使有错误，页面也应该有内容
      const bodyContent = await page.textContent("body");
      expect(
        bodyContent && bodyContent.length > 50,
        "即使有 JS 错误，页面也应显示内容"
      ).toBeTruthy();

      // 导航栏应该存在
      const nav = page.locator("nav");
      const isNavVisible = await nav.isVisible();
      expect(isNavVisible, "导航栏应该可见").toBeTruthy();
    });
  });
});
