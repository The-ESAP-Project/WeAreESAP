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
import { ROUTES, TIMEOUTS, VIEWPORTS } from "./fixtures/test-data";
import { navigateAndWait, waitForAnimation } from "./utils/helpers";

test.describe("技术页面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.TECH);
  });

  test("应该成功加载技术页面", async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/技术|Tech|テクノロジー/i);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示 Hero 区域内容", async ({ page }) => {
    // 验证主标题存在
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText(/技术|tech|テクノロジー/i);

    // 验证副标题存在
    const subtitle = page.locator("section p").first();
    await expect(subtitle).toBeVisible();

    // 验证装饰线存在（在移动端可能被隐藏，只检查是否存在）
    const decorativeLine = page.locator("div.bg-linear-to-r.from-esap-yellow");
    await expect(decorativeLine.first()).toBeAttached();
  });

  test("应该加载技术模块内容", async ({ page }) => {
    // 等待加载完成
    await page.waitForLoadState("networkidle");

    // 验证主内容区域存在
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // 验证有多个 section
    const sections = page.locator("main section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test("应该显示技术模块标签或卡片", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证页面有多个标题元素（可能是模块标题）
    const headings = page.locator("h2, h3");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // 验证有内容段落
    const paragraphs = page.locator("p");
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(1);
  });

  test("应该支持技术模块间的交互", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 查找可能的交互元素（按钮、标签页等）
    const interactiveElements = page.locator("button, [role='tab']");
    const elementsCount = await interactiveElements.count();

    if (elementsCount > 0) {
      // 如果有交互元素，尝试点击第一个
      const firstElement = interactiveElements.first();
      await expect(firstElement).toBeVisible();
      await firstElement.click();
      await waitForAnimation(page, TIMEOUTS.ANIMATION);

      // 验证页面仍然正常显示
      const mainContent = page.locator("main");
      await expect(mainContent).toBeVisible();
    }
  });

  test("应该显示技术模块的详细信息", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证页面有描述性文本
    const descriptions = page.locator("p");
    const descCount = await descriptions.count();
    expect(descCount).toBeGreaterThan(2);

    // 验证有标题结构
    const allHeadings = page.locator("h1, h2, h3, h4");
    const headingCount = await allHeadings.count();
    expect(headingCount).toBeGreaterThan(1);
  });

  test("应该支持页面滚动", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 获取初始位置
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // 滚动页面
    await page.evaluate(() => window.scrollBy(0, 600));
    await waitForAnimation(page, 800);

    // 验证已滚动
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(initialScrollY);

    // 滚动回顶部
    await page.evaluate(() => window.scrollTo(0, 0));
    await waitForAnimation(page, 800);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);
  });

  test("应该在移动端正确显示", async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize(VIEWPORTS.MOBILE);
    await page.goto(ROUTES.TECH);
    await page.waitForLoadState("networkidle");

    // 验证导航栏在移动端可见
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // 验证标题在移动端可见
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();

    // 验证内容适配移动端
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("应该支持主题切换", async ({ page }) => {
    // 查找主题切换按钮
    const themeToggle = page.getByLabel("切换主题");
    await expect(themeToggle).toBeVisible();

    // 获取初始主题
    const htmlElement = page.locator("html");
    const initialClass = await htmlElement.getAttribute("class");

    // 切换主题
    await themeToggle.click();
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证主题已更改
    const newClass = await htmlElement.getAttribute("class");
    expect(newClass).not.toBe(initialClass);
  });

  test("应该能够导航到其他页面", async ({ page }) => {
    // 点击导航到项目页面
    const projectLink = page.locator('nav a[href*="project"]').first();

    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // 验证已导航到项目页面
      await expect(page).toHaveURL(/\/project/);
    }
  });

  test("应该在不同语言环境下加载技术页面", async ({ page }) => {
    // 测试中文版本
    await navigateAndWait(page, "/zh/tech");
    const zhTitle = page.locator("h1").first();
    await expect(zhTitle).toBeVisible();

    // 测试英文版本
    await navigateAndWait(page, "/en/tech");
    const enTitle = page.locator("h1").first();
    await expect(enTitle).toBeVisible();

    // 测试日文版本
    await navigateAndWait(page, "/ja/tech");
    const jaTitle = page.locator("h1").first();
    await expect(jaTitle).toBeVisible();
  });

  test("应该正确处理空数据状态", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 即使没有技术模块数据，页面也应该显示
    const mainElement = page.locator("main");
    await expect(mainElement).toBeVisible();

    // 验证至少有 Hero 区域
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeVisible();
  });

  test("应该验证页面基本布局结构", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证主容器
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).toHaveClass(/min-h-screen/);

    // 验证有多个 section
    const sections = page.locator("main > section");
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // 验证响应式容器
    const containers = page.locator(".max-w-7xl, .max-w-5xl, .max-w-4xl");
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);
  });

  test("应该在平板设备上正确显示", async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize(VIEWPORTS.TABLET);
    await page.goto(ROUTES.TECH);
    await page.waitForLoadState("networkidle");

    // 验证布局
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // 验证标题可见
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();

    // 验证视口尺寸
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(VIEWPORTS.TABLET.width);
  });

  test("应该显示技术模块的视觉元素", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证有背景色区域（用于区分不同模块）
    const coloredSections = page.locator("section[class*='bg-']");
    const coloredCount = await coloredSections.count();
    expect(coloredCount).toBeGreaterThan(0);

    // 验证有圆角元素（卡片设计）
    const roundedElements = page.locator("[class*='rounded']");
    const roundedCount = await roundedElements.count();
    expect(roundedCount).toBeGreaterThan(0);
  });

  test("应该支持键盘导航", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 按 Tab 键聚焦第一个可交互元素
    await page.keyboard.press("Tab");
    await waitForAnimation(page, 100);

    // 验证有元素获得焦点
    const focusedElement = page.locator(":focus");
    const hasFocus = await focusedElement.count();
    expect(hasFocus).toBeGreaterThan(0);
  });
});
