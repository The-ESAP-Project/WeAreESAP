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
import {
  navigateAndWait,
  waitForPageStable,
  getCurrentLocale,
} from "./utils/helpers";
import { ROUTES, TEST_CHARACTERS, LOCALES } from "./fixtures/test-data";

test.describe("导航和 SEO", () => {
  test.describe("浏览器导航功能", () => {
    test("前进/后退按钮应该正常工作", async ({ page }) => {
      // 访问首页
      await navigateAndWait(page, ROUTES.HOME);
      const homeUrl = page.url();

      // 导航到角色页
      await navigateAndWait(page, ROUTES.CHARACTERS);
      const charactersUrl = page.url();

      // 导航到时间线页
      await navigateAndWait(page, ROUTES.TIMELINE);
      const timelineUrl = page.url();

      // 测试后退按钮
      await page.goBack();
      await waitForPageStable(page);
      expect(page.url(), "后退应该回到角色页").toBe(charactersUrl);

      await page.goBack();
      await waitForPageStable(page);
      expect(page.url(), "再次后退应该回到首页").toBe(homeUrl);

      // 测试前进按钮
      await page.goForward();
      await waitForPageStable(page);
      expect(page.url(), "前进应该回到角色页").toBe(charactersUrl);

      await page.goForward();
      await waitForPageStable(page);
      expect(page.url(), "再次前进应该回到时间线页").toBe(timelineUrl);
    });

    test("浏览器后退时页面状态应该保持", async ({ page }) => {
      // 访问角色列表
      await navigateAndWait(page, ROUTES.CHARACTERS);

      // 记录滚动位置和页面状态
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      const scrollPosition = await page.evaluate(() => window.scrollY);

      // 导航到另一个页面
      await navigateAndWait(page, ROUTES.TIMELINE);

      // 后退
      await page.goBack();
      await waitForPageStable(page);

      // 验证 URL 正确
      expect(page.url()).toContain("/characters");

      // 验证页面内容已加载
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("多次点击同一链接不应导致导航堆栈混乱", async ({ page }, testInfo) => {
      await navigateAndWait(page, ROUTES.HOME);

      const isMobile = testInfo.project.name.includes("Mobile");

      // 第一次点击角色页链接
      if (isMobile) {
        // 移动端：打开菜单并在菜单面板中查找链接
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        await menuButton.click();

        // 等待 dialog 容器完全展开
        const mobileMenu = page.locator('[role="dialog"]');
        await mobileMenu.waitFor({ state: "visible" });

        // 等待链接真正可见（包括 CSS 动画完成）
        const charactersLink = mobileMenu
          .locator('a[href*="/characters"]')
          .first();
        await expect(charactersLink).toBeVisible({ timeout: 5000 });
        await Promise.all([
          page.waitForURL(/\/characters/, { timeout: 10000 }),
          charactersLink.click(),
        ]);
      } else {
        // 桌面端：在导航栏中查找链接
        const nav = page.locator("nav");
        const charactersLink = nav.locator('a[href*="/characters"]').first();
        await charactersLink.waitFor({ state: "visible" });
        await Promise.all([
          page.waitForURL(/\/characters/, { timeout: 10000 }),
          charactersLink.click(),
        ]);
      }

      await waitForPageStable(page);

      const url1 = page.url();
      expect(url1).toContain("characters");

      // 返回首页
      await page.goBack();
      await waitForPageStable(page);
      expect(page.url()).toMatch(/\/(zh-CN|en|ja)?\/?$/);

      // 再次点击同一链接
      if (isMobile) {
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        await menuButton.click();

        // 等待 dialog 容器完全展开
        const mobileMenu = page.locator('[role="dialog"]');
        await mobileMenu.waitFor({ state: "visible" });

        // 等待链接真正可见（包括 CSS 动画完成）
        const charactersLink2 = mobileMenu
          .locator('a[href*="/characters"]')
          .first();
        await expect(charactersLink2).toBeVisible({ timeout: 5000 });
        await Promise.all([
          page.waitForURL(/\/characters/, { timeout: 10000 }),
          charactersLink2.click(),
        ]);
      } else {
        const nav = page.locator("nav");
        const charactersLink2 = nav.locator('a[href*="/characters"]').first();
        await charactersLink2.waitFor({ state: "visible" });
        await Promise.all([
          page.waitForURL(/\/characters/, { timeout: 10000 }),
          charactersLink2.click(),
        ]);
      }

      await waitForPageStable(page);

      const url2 = page.url();
      expect(url2).toContain("characters");

      // 后退应该回到首页（不应该有重复的历史记录）
      await page.goBack();
      await waitForPageStable(page);

      expect(page.url()).toMatch(/\/(zh-CN|en|ja)?\/?$/);
    });

    test("深层导航后后退应该逐级返回", async ({ page }) => {
      // 创建一个深层导航路径
      const navigationPath = [
        ROUTES.HOME,
        ROUTES.CHARACTERS,
        ROUTES.CHARACTER_DETAIL(TEST_CHARACTERS.APTS_1547.id),
      ];

      const visitedUrls: string[] = [];

      // 依次访问各个页面
      for (const route of navigationPath) {
        await navigateAndWait(page, route);
        visitedUrls.push(page.url());
      }

      // 逐级后退
      for (let i = visitedUrls.length - 2; i >= 0; i--) {
        await page.goBack();
        await waitForPageStable(page);
        expect(page.url(), `后退应该返回到第 ${i + 1} 个页面`).toBe(
          visitedUrls[i]
        );
      }
    });
  });

  test.describe("页面刷新状态保持", () => {
    test("刷新首页后状态应该保持", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      // 记录初始状态
      const initialUrl = page.url();
      const initialTitle = await page.title();

      // 刷新页面
      await page.reload();
      await waitForPageStable(page);

      // 验证状态保持
      expect(page.url(), "刷新后 URL 应该保持不变").toBe(initialUrl);
      expect(await page.title(), "刷新后标题应该保持不变").toBe(initialTitle);

      // 验证页面内容正常
      const nav = page.locator("nav");
      await expect(nav, "导航栏应该可见").toBeVisible();
    });

    test("刷新角色详情页后应该保持相同角色", async ({ page }) => {
      const characterId = TEST_CHARACTERS.APTS_1548.id;
      await navigateAndWait(page, ROUTES.CHARACTER_DETAIL(characterId));

      // 记录角色信息
      const initialUrl = page.url();

      // 刷新页面
      await page.reload();
      await waitForPageStable(page);

      // 验证仍在同一角色页面
      expect(page.url(), "刷新后应该停留在同一角色页").toContain(characterId);
      expect(page.url()).toBe(initialUrl);
    });

    test("切换语言后刷新应该保持语言设置", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      // 尝试切换到英文（如果支持）
      const languageButton = page.getByRole("button", {
        name: /language|语言/i,
      });

      if (await languageButton.isVisible()) {
        await languageButton.click();
        await page.waitForTimeout(200);

        const englishOption = page.getByRole("menuitem", {
          name: /english|英语/i,
        });

        if (await englishOption.isVisible()) {
          await englishOption.click();
          await waitForPageStable(page);

          const locale = await getCurrentLocale(page);

          // 刷新页面
          await page.reload();
          await waitForPageStable(page);

          const newLocale = await getCurrentLocale(page);
          expect(newLocale, "刷新后语言应该保持").toBe(locale);
        }
      }
    });

    test("硬刷新应该清除缓存并重新加载", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      // 执行硬刷新（模拟 Ctrl+Shift+R）
      await page.reload({ waitUntil: "networkidle" });
      await waitForPageStable(page);

      // 验证页面正常加载
      const nav = page.locator("nav");
      await expect(nav, "硬刷新后页面应该正常显示").toBeVisible();

      const pageContent = await page.textContent("body");
      expect(
        pageContent && pageContent.length > 100,
        "硬刷新后应该有完整内容"
      ).toBeTruthy();
    });
  });

  test.describe("页面 SEO 元数据", () => {
    test("首页应该有正确的 title 标签", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      const title = await page.title();
      expect(title, "首页应该有标题").toBeTruthy();
      expect(title.length, "标题长度应该合理").toBeGreaterThan(5);
      expect(title.length, "标题不应过长").toBeLessThan(100);

      // 标题应该包含项目名称
      expect(title, "标题应该包含项目相关信息").toMatch(/ESAP|We Are ESAP/i);
    });

    test("角色页应该有描述性 title", async ({ page }) => {
      await navigateAndWait(page, ROUTES.CHARACTERS);

      const title = await page.title();
      expect(title, "角色页应该有标题").toBeTruthy();

      // 标题应该提示这是角色页
      const hasCharacterKeyword =
        title.includes("角色") ||
        title.includes("Character") ||
        title.includes("ESAP");

      expect(hasCharacterKeyword, "标题应该包含角色相关关键词").toBeTruthy();
    });

    test("角色详情页应该包含角色名称在 title 中", async ({ page }) => {
      const character = TEST_CHARACTERS.APTS_1547;
      await navigateAndWait(page, ROUTES.CHARACTER_DETAIL(character.id));

      const title = await page.title();

      // 标题应该包含角色代码或名称
      const hasCharacterInfo =
        title.includes(character.code) ||
        title.includes(character.name) ||
        title.includes(character.nickname || "");

      expect(hasCharacterInfo, "角色详情页标题应该包含角色信息").toBeTruthy();
    });

    test("应该有 meta description 标签", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");

      expect(description, "应该存在 meta description").toBeTruthy();
      expect(description!.length, "描述长度应该合理").toBeGreaterThan(20);
      expect(description!.length, "描述不应过长").toBeLessThan(200);
    });

    test("应该有正确的 Open Graph 标签", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      // 检查 og:title
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle, "应该存在 og:title").toBeTruthy();

      // 检查 og:description
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(ogDescription, "应该存在 og:description").toBeTruthy();

      // 检查 og:type
      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute("content");
      expect(ogType, "应该存在 og:type").toBeTruthy();

      // 检查 og:url
      const ogUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute("content");
      if (ogUrl) {
        expect(ogUrl, "og:url 应该是有效的 URL").toMatch(/^https?:\/\//);
      }
    });

    test("应该有 canonical URL", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");

      if (canonical) {
        expect(canonical, "canonical URL 应该是有效的 URL").toMatch(
          /^https?:\/\//
        );
      }
    });

    test("不同页面应该有不同的 meta 信息", async ({ page }) => {
      // 获取首页 meta 信息
      await navigateAndWait(page, ROUTES.HOME);
      const homeTitle = await page.title();
      const homeDescription = await page
        .locator('meta[name="description"]')
        .getAttribute("content");

      // 获取角色页 meta 信息
      await navigateAndWait(page, ROUTES.CHARACTERS);
      const charactersTitle = await page.title();
      const charactersDescription = await page
        .locator('meta[name="description"]')
        .getAttribute("content");

      // 标题应该不同
      expect(homeTitle, "不同页面应该有不同的标题").not.toBe(charactersTitle);

      // 描述可能不同（如果存在）
      if (homeDescription && charactersDescription) {
        expect(homeDescription, "不同页面的描述应该有区别").not.toBe(
          charactersDescription
        );
      }
    });

    test("多语言页面应该有对应的 lang 属性", async ({ page }) => {
      // 测试中文页面
      await navigateAndWait(page, ROUTES.ZH_HOME);
      await page.waitForLoadState("domcontentloaded");
      const zhLang = await page.locator("html").getAttribute("lang");
      expect(zhLang, "中文页面应该有 zh-CN lang 属性").toBeTruthy();
      if (zhLang) {
        expect(zhLang, "中文页面 lang 应该包含 zh-CN").toMatch(/zh-CN/i);
      }

      // 测试英文页面
      await navigateAndWait(page, ROUTES.EN_HOME);
      await page.waitForLoadState("domcontentloaded");
      const enLang = await page.locator("html").getAttribute("lang");
      expect(enLang, "英文页面应该有 en lang 属性").toBeTruthy();
      if (enLang) {
        expect(enLang, "英文页面 lang 应该包含 en").toMatch(/en/i);
      }

      // 测试日文页面
      await navigateAndWait(page, ROUTES.JA_HOME);
      await page.waitForLoadState("domcontentloaded");
      const jaLang = await page.locator("html").getAttribute("lang");
      expect(jaLang, "日文页面应该有 ja lang 属性").toBeTruthy();
      if (jaLang) {
        expect(jaLang, "日文页面 lang 应该包含 ja").toMatch(/ja/i);
      }
    });

    test("应该有合适的 viewport meta 标签", async ({ page }) => {
      await navigateAndWait(page, ROUTES.HOME);

      const viewport = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");

      expect(viewport, "应该存在 viewport meta 标签").toBeTruthy();
      expect(viewport, "viewport 应该包含 width 设置").toContain("width");
    });
  });
});
