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

test.describe("项目页面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.PROJECT);
  });

  test("应该成功加载项目页面", async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/项目|Project|プロジェクト/i);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示 Hero 区域内容", async ({ page }) => {
    // 验证主标题
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();

    // 验证副标题（蓝色文字）
    const subtitle = page.locator("p.text-esap-blue").first();
    await expect(subtitle).toBeVisible();

    // 验证引用块存在
    const quote = page.locator("blockquote").first();
    await expect(quote).toBeVisible();

    // 验证装饰线（在移动端可能被隐藏，只检查是否存在）
    const decorativeLine = page.locator("div.bg-linear-to-r.from-esap-yellow");
    await expect(decorativeLine.first()).toBeAttached();
  });

  test("应该显示 '什么是逃离' 区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 查找包含标题的 h2
    const headings = page.locator("h2");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(2);

    // 验证有列表项（介绍逃离概念的要点）
    const listItems = page.locator("li");
    const listCount = await listItems.count();
    expect(listCount).toBeGreaterThan(0);
  });

  test("应该显示三大支柱理念区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到三大支柱区域
    const pillarsSection = page.locator("section").nth(2);
    await pillarsSection.scrollIntoViewIfNeeded();
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证区域可见
    await expect(pillarsSection).toBeVisible();

    // 验证有卡片网格布局
    const grid = page.locator(".grid");
    const gridCount = await grid.count();
    expect(gridCount).toBeGreaterThan(0);
  });

  test("应该显示核心价值观区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 查找所有 h2 标题
    const headings = page.locator("h2");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(2);

    // 验证有多个价值观卡片
    const cards = page.locator(".rounded-xl");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(3);
  });

  test("应该显示世界观框架区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到世界观区域
    await page.evaluate(() => window.scrollBy(0, 1500));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证技术基石区域（黄色标题）
    const yellowHeading = page.locator("h3.text-esap-yellow");
    const yellowCount = await yellowHeading.count();
    expect(yellowCount).toBeGreaterThan(0);

    // 验证故事背景区域（蓝色标题）
    const blueHeading = page.locator("h3.text-esap-blue");
    const blueCount = await blueHeading.count();
    expect(blueCount).toBeGreaterThan(0);
  });

  test("应该显示参与方式区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到参与方式区域
    await page.evaluate(() => window.scrollBy(0, 2000));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有多个参与方式卡片
    const participationCards = page.locator(".grid .rounded-xl");
    const cardCount = await participationCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("应该显示 ESAP 的意义区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到意义区域
    await page.evaluate(() => window.scrollBy(0, 2500));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有黄色高亮的标题
    const yellowTitles = page.locator("h3.text-esap-yellow");
    const titleCount = await yellowTitles.count();
    expect(titleCount).toBeGreaterThan(0);

    // 验证有要点列表
    const bulletPoints = page.locator("span.text-esap-yellow");
    const bulletCount = await bulletPoints.count();
    expect(bulletCount).toBeGreaterThan(0);
  });

  test("应该显示三角形标志说明区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到三角形标志区域
    await page.evaluate(() => window.scrollBy(0, 3000));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有引用块（蓝色边框）
    const blueQuote = page.locator("blockquote.border-esap-blue");
    const quoteExists = await blueQuote.count();
    expect(quoteExists).toBeGreaterThan(0);
  });

  test("应该显示结语区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有黄色高亮文字
    const yellowText = page.locator("p.text-esap-yellow");
    const yellowExists = await yellowText.count();
    expect(yellowExists).toBeGreaterThan(0);

    // 验证有装饰线
    const decorativeLine = page.locator("div.bg-linear-to-r.from-esap-yellow");
    const lineCount = await decorativeLine.count();
    expect(lineCount).toBeGreaterThan(0);
  });

  test("应该支持页面滚动", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 获取初始位置
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // 向下滚动
    await page.evaluate(() => window.scrollBy(0, 1000));
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
    await page.goto(ROUTES.PROJECT);
    await page.waitForLoadState("networkidle");

    // 验证导航栏可见
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // 验证主标题可见
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();

    // 验证内容区域适配移动端
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
    // 点击导航到加入我们页面
    const joinLink = page.locator('nav a[href*="join"]').first();

    if (await joinLink.isVisible()) {
      await joinLink.click();
      await page.waitForLoadState("networkidle");

      // 验证已导航到加入页面
      await expect(page).toHaveURL(/\/join/);
    }
  });

  test("应该在不同语言环境下加载项目页面", async ({ page }) => {
    // 测试简体中文版本
    await navigateAndWait(page, "/project");
    const zhTitle = page.locator("h1").first();
    await expect(zhTitle).toBeVisible();

    // 测试英文版本
    await navigateAndWait(page, "/en/project");
    const enTitle = page.locator("h1").first();
    await expect(enTitle).toBeVisible();

    // 测试日文版本
    await navigateAndWait(page, "/ja/project");
    const jaTitle = page.locator("h1").first();
    await expect(jaTitle).toBeVisible();
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
    expect(count).toBeGreaterThanOrEqual(5); // 至少有多个主要区域

    // 验证响应式容器
    const containers = page.locator(
      ".max-w-5xl, .max-w-6xl, .max-w-7xl, .max-w-4xl, .max-w-3xl"
    );
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);
  });

  test("应该在平板设备上正确显示", async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize(VIEWPORTS.TABLET);
    await page.goto(ROUTES.PROJECT);
    await page.waitForLoadState("networkidle");

    // 验证布局
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // 验证标题可见
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();

    // 验证网格布局适配平板
    const grids = page.locator(".grid");
    const gridCount = await grids.count();
    expect(gridCount).toBeGreaterThan(0);
  });

  test("应该显示多彩的视觉元素", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证有黄色元素
    const yellowElements = page.locator("[class*='esap-yellow']");
    const yellowCount = await yellowElements.count();
    expect(yellowCount).toBeGreaterThan(0);

    // 验证有蓝色元素
    const blueElements = page.locator("[class*='esap-blue']");
    const blueCount = await blueElements.count();
    expect(blueCount).toBeGreaterThan(0);

    // 验证有粉色元素
    const pinkElements = page.locator("[class*='esap-pink']");
    const pinkCount = await pinkElements.count();
    expect(pinkCount).toBeGreaterThan(0);
  });

  test("应该有良好的可读性", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证有足够的段落文本
    const paragraphs = page.locator("p");
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThan(10);

    // 验证有标题层级结构
    const h2Count = await page.locator("h2").count();
    const h3Count = await page.locator("h3").count();
    expect(h2Count + h3Count).toBeGreaterThan(5);

    // 验证有列表结构
    const lists = page.locator("ul, ol");
    const listCount = await lists.count();
    expect(listCount).toBeGreaterThan(0);
  });
});
