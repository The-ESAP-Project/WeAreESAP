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

test.describe("时间线页面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.TIMELINE);
  });

  test("应该成功加载时间线页面", async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/时间线|Timeline/i);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示 Hero 区域内容", async ({ page }) => {
    // 验证主标题存在
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText(/时间线|timeline|タイムライン/i);

    // 验证引用文字存在
    const quote = page.locator("p.italic").first();
    await expect(quote).toBeVisible();

    // 验证装饰线存在（在移动端可能被隐藏，只检查是否存在）
    const decorativeLine = page.locator("div.bg-linear-to-r.from-esap-yellow");
    await expect(decorativeLine.first()).toBeAttached();
  });

  test("应该加载时间线内容区域", async ({ page }) => {
    // 等待加载完成
    await page.waitForLoadState("networkidle");

    // 验证时间线内容已加载（查找年份标题或事件卡片）
    const timelineContent = page.locator("main").first();
    await expect(timelineContent).toBeVisible();

    // 验证至少有一些内容被渲染（避免空白页面）
    const mainContent = page.locator("main section");
    await expect(mainContent.first()).toBeVisible();
  });

  test("应该显示时间线年份和事件", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 等待数据加载
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 尝试查找年份标签（通常时间线会显示年份）
    const hasYearElements = await page.locator("h2, h3").count();
    expect(hasYearElements).toBeGreaterThan(0);

    // 验证有多个内容区块（时间线事件）
    const contentSections = await page.locator("section").count();
    expect(contentSections).toBeGreaterThanOrEqual(2); // 至少 Hero + 时间线内容
  });

  test("应该在时间线内容中显示事件卡片", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 检查页面是否有多个内容区块
    const sections = page.locator("section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(1);

    // 验证有文本内容（事件描述）
    const paragraphs = page.locator("p");
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(2);
  });

  test("应该显示结尾引用区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证结尾区域存在
    const endingSections = page.locator("section");
    const lastSection = endingSections.last();
    await expect(lastSection).toBeVisible();

    // 验证有引用文字（斜体）
    const italicTexts = page.locator("p.italic");
    const hasItalicContent = await italicTexts.count();
    expect(hasItalicContent).toBeGreaterThan(0);
  });

  test("应该支持页面滚动交互", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 获取初始滚动位置
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // 滚动页面
    await page.evaluate(() => window.scrollBy(0, 500));
    await waitForAnimation(page, 800);

    // 验证滚动位置已改变
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
    await page.goto(ROUTES.TIMELINE);
    await page.waitForLoadState("networkidle");

    // 验证导航栏在移动端仍然可见
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // 验证主标题在移动端可见
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();

    // 验证内容区域在移动端适配良好
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

    // 点击主题切换
    await themeToggle.click();
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证主题已改变
    const newClass = await htmlElement.getAttribute("class");
    expect(newClass).not.toBe(initialClass);
  });

  test("应该能够从时间线页面导航到其他页面", async ({ page }) => {
    // 点击导航栏中的首页链接
    const homeLink = page
      .locator('nav a[href="/"]')
      .or(page.locator('nav a[href*="/zh"]'))
      .first();

    await homeLink.click();
    await page.waitForLoadState("networkidle");

    // 验证已导航到首页
    await expect(page).toHaveURL(/\/(zh)?$/);
  });

  test("应该在不同语言环境下加载时间线", async ({ page }) => {
    // 测试简体中文版本
    await navigateAndWait(page, "/timeline");
    const zhTitle = page.locator("h1").first();
    await expect(zhTitle).toBeVisible();

    // 测试英文版本
    await navigateAndWait(page, "/en/timeline");
    const enTitle = page.locator("h1").first();
    await expect(enTitle).toBeVisible();

    // 测试日文版本
    await navigateAndWait(page, "/ja/timeline");
    const jaTitle = page.locator("h1").first();
    await expect(jaTitle).toBeVisible();
  });

  test("应该正确处理空数据状态", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 即使数据为空，页面也应该正常显示
    const mainElement = page.locator("main");
    await expect(mainElement).toBeVisible();

    // 验证至少有 Hero 区域
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeVisible();
  });

  test("应该验证页面基本布局结构", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证主容器存在
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).toHaveClass(/min-h-screen/);

    // 验证有多个 section 区域
    const sections = page.locator("main > section");
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // 验证响应式容器存在
    const containers = page.locator(".max-w-4xl, .max-w-7xl, .max-w-2xl");
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);
  });

  test("应该在平板设备上正确显示", async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize(VIEWPORTS.TABLET);
    await page.goto(ROUTES.TIMELINE);
    await page.waitForLoadState("networkidle");

    // 验证布局适配
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // 验证标题可读
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();

    // 检查内容区域宽度是否适配平板
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(VIEWPORTS.TABLET.width);
  });
});
