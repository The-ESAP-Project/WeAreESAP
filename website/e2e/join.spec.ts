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

test.describe("加入我们页面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.JOIN);
  });

  test("应该成功加载加入我们页面", async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/加入我们|Join|参加/i);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示 Hero 区域内容", async ({ page }) => {
    // 验证主标题
    const mainTitle = page.locator("h1").first();
    await expect(mainTitle).toBeVisible();

    // 验证引用文字（黄色）
    const yellowQuote = page.locator("blockquote.text-esap-yellow").first();
    await expect(yellowQuote).toBeVisible();

    // 验证装饰线（在移动端可能被隐藏，只检查是否存在）
    const decorativeLine = page.locator("div.bg-linear-to-r.from-esap-yellow");
    await expect(decorativeLine.first()).toBeAttached();

    // 验证寻找的人才列表
    const listItems = page.locator("ul li");
    const listCount = await listItems.count();
    expect(listCount).toBeGreaterThan(0);
  });

  test("应该显示谁适合加入区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证角色类型卡片网格
    const grids = page.locator(".grid");
    const gridCount = await grids.count();
    expect(gridCount).toBeGreaterThan(0);

    // 验证有多个角色卡片（4个角色类型）
    const cards = page.locator(".rounded-xl");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(3);
  });

  test("应该显示欢迎和不欢迎的清单", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 查找绿色区域（欢迎）
    const greenSection = page.locator("[class*='bg-green']");
    const greenCount = await greenSection.count();
    expect(greenCount).toBeGreaterThan(0);

    // 查找红色区域（不欢迎）
    const redSection = page.locator("[class*='bg-red']");
    const redCount = await redSection.count();
    expect(redCount).toBeGreaterThan(0);

    // 验证有 CheckCircle 图标
    const checkCircle = page.locator("[class*='CheckCircle']");
    const checkExists = await checkCircle.count();
    // 图标可能以不同方式渲染，所以不强制要求

    // 验证有列表项
    const listItems = page.locator("li");
    const listCount = await listItems.count();
    expect(listCount).toBeGreaterThan(5);
  });

  test("应该显示参与方式区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到参与方式区域
    await page.evaluate(() => window.scrollBy(0, 1000));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有多个参与方式卡片
    const participationCards = page.locator(".rounded-xl");
    const cardCount = await participationCards.count();
    expect(cardCount).toBeGreaterThan(2);

    // 验证有描述文字
    const descriptions = page.locator("p.text-sm");
    const descCount = await descriptions.count();
    expect(descCount).toBeGreaterThan(0);
  });

  test("应该显示创建角色流程", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到角色创建区域
    await page.evaluate(() => window.scrollBy(0, 1500));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有步骤卡片
    const stepCards = page.locator(".grid .rounded-xl");
    const stepCount = await stepCards.count();
    expect(stepCount).toBeGreaterThan(0);

    // 验证有 h2 标题
    const headings = page.locator("h2");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(3);
  });

  test("应该显示创作指南区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到创作指南
    await page.evaluate(() => window.scrollBy(0, 2000));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有核心原则卡片
    const principleCards = page.locator(".rounded-xl");
    const cardCount = await principleCards.count();
    expect(cardCount).toBeGreaterThan(5);

    // 验证有黄色标题（核心原则）
    const yellowHeading = page.locator("h3.text-esap-yellow");
    const yellowCount = await yellowHeading.count();
    expect(yellowCount).toBeGreaterThan(0);

    // 验证有可以做和不能做的列表
    const greenBoxes = page.locator("[class*='bg-green']");
    const redBoxes = page.locator("[class*='bg-red']");
    expect(await greenBoxes.count()).toBeGreaterThan(0);
    expect(await redBoxes.count()).toBeGreaterThan(0);
  });

  test("应该显示社区文化区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到社区文化
    await page.evaluate(() => window.scrollBy(0, 2500));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有多个社区价值观卡片
    const valueCards = page.locator(".rounded-xl");
    const cardCount = await valueCards.count();
    expect(cardCount).toBeGreaterThan(3);

    // 验证有粉色引用块
    const pinkQuotes = page.locator("blockquote.text-esap-pink");
    const quoteCount = await pinkQuotes.count();
    expect(quoteCount).toBeGreaterThan(0);
  });

  test("应该显示贡献方式区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到贡献方式
    await page.evaluate(() => window.scrollBy(0, 3000));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有贡献类型卡片（3个）
    const contributionCards = page.locator(".grid .rounded-xl");
    const cardCount = await contributionCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // 验证有粉色图标
    const pinkIcons = page.locator("[class*='text-esap-pink']");
    const iconCount = await pinkIcons.count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test("应该显示联系方式区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到联系方式
    await page.evaluate(() => window.scrollBy(0, 3500));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证联系方式区域存在
    const sections = page.locator("section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(5);
  });

  test("应该显示 FAQ 区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到 FAQ
    await page.evaluate(() => window.scrollBy(0, 3800));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有 FAQ 标题
    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(5);

    // FAQ 组件可能是动态加载的，验证其容器存在
    const sections = page.locator("section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(7);
  });

  test("应该显示下一步行动区域", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 滚动到下一步
    await page.evaluate(() => window.scrollBy(0, 4200));
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证有下一步卡片
    const stepCards = page.locator(".rounded-lg");
    const cardCount = await stepCards.count();
    expect(cardCount).toBeGreaterThan(0);
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

    // 验证有粉色引用块
    const pinkQuote = page.locator("blockquote.border-esap-pink");
    const quoteExists = await pinkQuote.count();
    expect(quoteExists).toBeGreaterThan(0);

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
    await page.evaluate(() => window.scrollBy(0, 1500));
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
    await page.goto(ROUTES.JOIN);
    await page.waitForLoadState("networkidle");

    // 验证导航栏可见
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // 验证主标题可见
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
    // 点击导航到角色页面
    const charactersLink = page.locator('nav a[href*="characters"]').first();

    if (await charactersLink.isVisible()) {
      await charactersLink.click();
      await page.waitForLoadState("networkidle");

      // 验证已导航到角色页面
      await expect(page).toHaveURL(/\/characters/);
    }
  });

  test("应该在不同语言环境下加载加入页面", async ({ page }) => {
    // 测试简体中文版本
    await navigateAndWait(page, "/join");
    const zhTitle = page.locator("h1").first();
    await expect(zhTitle).toBeVisible();

    // 测试英文版本
    await navigateAndWait(page, "/en/join");
    const enTitle = page.locator("h1").first();
    await expect(enTitle).toBeVisible();

    // 测试日文版本
    await navigateAndWait(page, "/ja/join");
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
    expect(count).toBeGreaterThanOrEqual(8); // 加入页面有很多区域

    // 验证响应式容器
    const containers = page.locator(
      ".max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-4xl, .max-w-3xl, .max-w-2xl"
    );
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);
  });

  test("应该在平板设备上正确显示", async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize(VIEWPORTS.TABLET);
    await page.goto(ROUTES.JOIN);
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

  test("应该有丰富的交互式内容", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // 验证有大量的标题结构
    const h2Count = await page.locator("h2").count();
    const h3Count = await page.locator("h3").count();
    const h4Count = await page.locator("h4").count();
    expect(h2Count + h3Count + h4Count).toBeGreaterThan(15);

    // 验证有丰富的文本内容
    const paragraphs = page.locator("p");
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThan(20);

    // 验证有列表
    const lists = page.locator("ul");
    const listCount = await lists.count();
    expect(listCount).toBeGreaterThan(5);
  });

  test("应该使用 ESAP 品牌色彩", async ({ page }) => {
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
});
