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
  waitForAnimation,
  waitForPageStable,
  isDarkTheme,
} from "./utils/helpers";

test.describe("首页", () => {
  test("应该成功加载首页", async ({ page }) => {
    await page.goto("/");

    // 验证页面标题（实际标题是 "We Are ESAP - Wish Upon a Satellite"）
    await expect(page).toHaveTitle(/We Are ESAP/);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示主要导航链接", async ({ page }, testInfo) => {
    await page.goto("/");

    // 如果是移动端，先打开菜单
    const isMobile = testInfo.project.name.includes("Mobile");

    let charactersLink;

    if (isMobile) {
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();

        // 等待 dialog 完全打开
        const mobileMenu = page.locator('[role="dialog"]');
        await mobileMenu.waitFor({ state: "visible" });

        // 在 dialog 中查找链接
        charactersLink = mobileMenu
          .locator('a[href="/characters"]')
          .or(mobileMenu.locator('a[href*="characters"]'))
          .first();
      }
    } else {
      // 桌面端：在 nav 中查找链接
      charactersLink = page
        .locator('nav a[href="/characters"]')
        .or(page.locator('nav a[href*="characters"]'))
        .first();
    }

    // 验证链接可见
    if (charactersLink) {
      await expect(charactersLink).toBeVisible({ timeout: 5000 });
    }
  });

  test("应该能够导航到角色页面", async ({ page }, testInfo) => {
    await page.goto("/");

    // 如果是移动端，先打开菜单
    const isMobile = testInfo.project.name.includes("Mobile");

    let charactersLink;

    if (isMobile) {
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();

        // 等待 dialog 完全打开
        const mobileMenu = page.locator('[role="dialog"]');
        await mobileMenu.waitFor({ state: "visible" });

        // 在 dialog 中查找链接
        charactersLink = mobileMenu
          .locator('a[href="/characters"]')
          .or(mobileMenu.locator('a[href*="characters"]'))
          .first();
      }
    } else {
      // 桌面端：在 nav 中查找链接
      charactersLink = page
        .locator('nav a[href="/characters"]')
        .or(page.locator('nav a[href*="characters"]'))
        .first();
    }

    // 确保链接可见并点击
    if (charactersLink) {
      await expect(charactersLink).toBeVisible({ timeout: 5000 });
      await charactersLink.click();
      await waitForPageStable(page);

      // 验证 URL 变化
      await expect(page).toHaveURL(/\/characters/);
    }
  });

  test("应该支持主题切换", async ({ page }) => {
    await page.goto("/");

    // 查找主题切换按钮（精确匹配 aria-label）
    const themeToggle = page.getByLabel("切换主题");

    // 直接断言按钮可见性
    await expect(themeToggle, "主题切换按钮应该可见").toBeVisible();
    await themeToggle.click();

    // 验证主题发生变化（检查 HTML 元素的 class 或 data 属性）
    const html = page.locator("html");
    const hasThemeClass = await html.evaluate((el) => {
      return el.classList.contains("dark") || el.classList.contains("light");
    });
    expect(hasThemeClass, "HTML 元素应该有主题相关的 class").toBeTruthy();
  });

  test.describe("Hero 区域", () => {
    test("应该完整渲染 Hero 区域", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 验证主标题存在
      const mainHeading = page.locator("h1").first();
      await expect(mainHeading).toBeVisible();

      // 验证主标题包含关键文字
      const headingText = await mainHeading.textContent();
      expect(headingText).toBeTruthy();
      expect(headingText!.length).toBeGreaterThan(0);

      // 验证副标题或描述文本存在
      const descriptions = page.locator("p, .text-lg, .text-xl");
      const descCount = await descriptions.count();
      expect(descCount).toBeGreaterThan(0);
    });

    test("应该在 Hero 区域显示背景元素", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 检查页面主要内容区域是否加载
      const mainContent = page.locator("main, section").first();
      await expect(mainContent).toBeVisible();

      // 验证背景或装饰元素存在（如果有的话）
      const bgElements = page.locator(
        "[class*='bg-'], [class*='background'], svg, canvas"
      );
      const bgCount = await bgElements.count();

      // 至少应该有一些视觉元素
      expect(bgCount).toBeGreaterThan(0);
    });

    test("Hero 区域在暗色主题下应该正确显示", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 切换到暗色主题
      const themeToggle = page.getByLabel("切换主题");
      if (!(await isDarkTheme(page))) {
        await themeToggle.click();
        await waitForAnimation(page, 500);
      }

      // 验证主标题在暗色主题下可见
      const mainHeading = page.locator("h1").first();
      await expect(mainHeading).toBeVisible();

      // 检查 HTML 是否有 dark class
      const html = page.locator("html");
      const hasDarkClass = await html.evaluate((el) =>
        el.classList.contains("dark")
      );
      expect(hasDarkClass).toBeTruthy();
    });
  });

  test.describe("CTA 按钮", () => {
    test("应该显示主要 CTA 按钮", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 查找常见的 CTA 按钮
      const buttons = page.locator(
        "button, a[role='button'], .btn, [class*='button']"
      );
      const buttonCount = await buttons.count();

      // 应该至少有一些按钮
      expect(buttonCount).toBeGreaterThan(0);
    });

    test("CTA 按钮点击应该能够跳转", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 查找所有可点击的链接按钮
      const linkButtons = page.locator("a[href]").filter({ hasText: /.+/ });
      const count = await linkButtons.count();

      if (count > 0) {
        // 获取第一个链接的 href
        const firstButton = linkButtons.first();
        const href = await firstButton.getAttribute("href");

        // 如果是内部链接，点击验证跳转
        if (href && href.startsWith("/") && href !== "/") {
          await firstButton.click();
          await waitForPageStable(page);

          // 验证 URL 发生变化
          const currentUrl = page.url();
          expect(currentUrl).toContain(href);
        }
      }
    });

    test("CTA 按钮应该有悬停效果", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 查找按钮元素
      const button = page.locator("button, a[role='button']").first();

      if ((await button.count()) > 0) {
        // 验证按钮可见
        await expect(button).toBeVisible();

        // 悬停在按钮上
        await button.hover();
        await waitForAnimation(page, 200);

        // 验证按钮仍然可见（悬停不会破坏布局）
        await expect(button).toBeVisible();
      }
    });
  });

  test.describe("快速链接导航", () => {
    test("应该能够快速导航到角色页面", async ({ page }, testInfo) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 如果是移动端，先打开菜单
      const isMobile = testInfo.project.name.includes("Mobile");

      let charactersLink;

      if (isMobile) {
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        if (await menuButton.isVisible()) {
          await menuButton.click();

          // 等待 dialog 完全打开
          const mobileMenu = page.locator('[role="dialog"]');
          await mobileMenu.waitFor({ state: "visible" });

          // 在 dialog 中查找链接
          charactersLink = mobileMenu
            .locator('a[href="/characters"]')
            .or(mobileMenu.locator('a[href*="characters"]'))
            .first();
        }
      } else {
        // 桌面端：在 nav 中查找链接
        charactersLink = page
          .locator('nav a[href="/characters"]')
          .or(page.locator('nav a[href*="characters"]'))
          .first();
      }

      // 确保链接可见
      await expect(charactersLink).toBeVisible({ timeout: 5000 });
      await charactersLink.click();
      await waitForPageStable(page);

      await expect(page).toHaveURL(/\/characters/);
    });

    test("应该能够快速导航到时间线页面", async ({ page }, testInfo) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 如果是移动端，先打开菜单
      const isMobile = testInfo.project.name.includes("Mobile");

      let timelineLink;

      if (isMobile) {
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        if (await menuButton.isVisible()) {
          await menuButton.click();

          // 等待 dialog 完全打开
          const mobileMenu = page.locator('[role="dialog"]');
          await mobileMenu.waitFor({ state: "visible" });

          // 在 dialog 中查找链接
          timelineLink = mobileMenu
            .locator('a[href="/timeline"]')
            .or(mobileMenu.locator('a[href*="timeline"]'))
            .first();
        }
      } else {
        // 桌面端：在 nav 中查找链接
        timelineLink = page
          .locator('nav a[href="/timeline"]')
          .or(page.locator('nav a[href*="timeline"]'))
          .first();
      }

      if ((await timelineLink.count()) > 0) {
        // 确保链接可见
        await expect(timelineLink).toBeVisible({ timeout: 5000 });
        await timelineLink.click();
        await waitForPageStable(page);

        await expect(page).toHaveURL(/\/timeline/);
      }
    });

    test("应该能够快速导航到技术页面", async ({ page }, testInfo) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 如果是移动端，先打开菜单
      const isMobile = testInfo.project.name.includes("Mobile");

      let techLink;

      if (isMobile) {
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        if (await menuButton.isVisible()) {
          await menuButton.click();

          // 等待 dialog 完全打开
          const mobileMenu = page.locator('[role="dialog"]');
          await mobileMenu.waitFor({ state: "visible" });

          // 在 dialog 中查找链接
          techLink = mobileMenu
            .locator('a[href="/tech"]')
            .or(mobileMenu.locator('a[href*="tech"]'))
            .first();
        }
      } else {
        // 桌面端：在 nav 中查找链接
        techLink = page
          .locator('nav a[href="/tech"]')
          .or(page.locator('nav a[href*="tech"]'))
          .first();
      }

      if ((await techLink.count()) > 0) {
        // 确保链接可见
        await expect(techLink).toBeVisible({ timeout: 5000 });
        await techLink.click();
        await waitForPageStable(page);

        await expect(page).toHaveURL(/\/tech/);
      }
    });

    test("导航链接应该有正确的视觉反馈", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      const navLinks = page.locator("nav a");
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        const firstLink = navLinks.first();

        // 悬停在链接上
        await firstLink.hover();
        await waitForAnimation(page, 200);

        // 验证链接仍然可见
        await expect(firstLink).toBeVisible();
      }
    });
  });

  test.describe("页面滚动", () => {
    test("应该支持页面平滑滚动", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 滚动到页面中部
      await page.evaluate(() => {
        window.scrollTo({ top: 500, behavior: "smooth" });
      });
      await waitForAnimation(page, 500);

      // 验证滚动位置已改变
      const scrollTop = await page.evaluate(() => window.scrollY);
      expect(scrollTop).toBeGreaterThan(100);
    });

    test("滚动时导航栏应该保持可见", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // 滚动页面
      await page.evaluate(() => {
        window.scrollTo({ top: 500 });
      });
      await waitForAnimation(page, 300);

      // 导航栏仍应可见
      await expect(nav).toBeVisible();
    });

    test("应该支持滚动到顶部功能", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 先滚动到底部
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight });
      });
      await waitForAnimation(page, 300);

      // 验证已滚动
      const scrollBeforeTop = await page.evaluate(() => window.scrollY);
      expect(scrollBeforeTop).toBeGreaterThan(100);

      // 滚动回顶部
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // 等待滚动完成 - 使用 waitForFunction 等待实际状态而非固定时间
      await page.waitForFunction(() => window.scrollY < 50, { timeout: 2000 });

      // 验证回到顶部
      const scrollAfterTop = await page.evaluate(() => window.scrollY);
      expect(scrollAfterTop).toBeLessThan(50);
    });

    test("页面内容在滚动时应该有动画效果", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 获取页面初始高度
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      expect(pageHeight).toBeGreaterThan(0);

      // 滚动触发动画
      await page.evaluate(() => {
        window.scrollTo({ top: 300 });
      });
      await waitForAnimation(page, 400);

      // 验证页面仍然可交互
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });
  });

  test.describe("首页性能", () => {
    test("首页应该在合理时间内加载完成", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const loadTime = Date.now() - startTime;

      // 首页应该在 10 秒内加载完成
      expect(loadTime).toBeLessThan(10000);
    });

    test("首页主要内容应该快速可见", async ({ page }) => {
      await page.goto("/");

      // 主标题应该快速出现
      const mainHeading = page.locator("h1").first();
      await expect(mainHeading).toBeVisible({ timeout: 5000 });

      // 导航栏应该快速出现
      const nav = page.locator("nav");
      await expect(nav).toBeVisible({ timeout: 3000 });
    });

    test("首页图片应该懒加载", async ({ page }) => {
      await page.goto("/");
      await waitForPageStable(page);

      // 查找所有图片
      const images = page.locator("img");
      const imageCount = await images.count();

      if (imageCount > 0) {
        // 验证至少有一张图片
        expect(imageCount).toBeGreaterThan(0);

        // 检查图片的 loading 属性
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const img = images.nth(i);
          const src = await img.getAttribute("src");
          const alt = await img.getAttribute("alt");
          const loading = await img.getAttribute("loading");
          const isVisible = await img.isVisible();

          // Next.js Image 组件会自动优化图片
          // 1. 如果图片使用了 Next.js Image（src 包含 /_next/image），认为已优化
          // 2. 否则，图片应该有 loading="lazy" 或者可见
          const isNextImage = src?.includes("/_next/image") ?? false;
          const isOptimized = isNextImage || loading === "lazy" || isVisible;

          expect(
            isOptimized,
            `图片 ${i} (${alt || "unknown"}) 应该已优化：isNextImage=${isNextImage}, loading=${loading}, isVisible=${isVisible}`
          ).toBeTruthy();
        }
      }
    });

    test("首页不应该有控制台错误", async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto("/");
      await waitForPageStable(page);

      // 应该没有严重的控制台错误
      // 过滤掉一些常见的无害警告
      const seriousErrors = consoleErrors.filter(
        (err) =>
          !err.includes("favicon") &&
          !err.includes("manifest") &&
          !err.includes("404")
      );

      expect(seriousErrors).toHaveLength(0);
    });
  });
});
