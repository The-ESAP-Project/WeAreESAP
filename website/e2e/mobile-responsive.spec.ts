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
import { CharacterListPage } from "./pages/CharacterListPage";
import { CharacterDetailPage } from "./pages/CharacterDetailPage";
import {
  waitForPageStable,
  scrollToElement,
  isInViewport,
} from "./utils/helpers";
import { ROUTES, TEST_CHARACTERS } from "./fixtures/test-data";

test.describe("移动端响应式测试", () => {
  test.use({
    viewport: { width: 393, height: 851 }, // Pixel 5 尺寸
  });

  test("角色列表卡片应该在移动端正确布局", async ({ page }) => {
    const characterListPage = new CharacterListPage(page);
    await characterListPage.navigate();
    await characterListPage.waitForPageLoad();

    // 获取角色卡片
    const cards = characterListPage.getCharacterCards();
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    // 检查第一个卡片的宽度是否适应移动端
    const firstCard = cards.first();
    const box = await firstCard.boundingBox();

    if (box) {
      // 卡片宽度应该不超过视口宽度
      expect(box.width).toBeLessThanOrEqual(393);
      // 卡片应该有合理的高度
      expect(box.height).toBeGreaterThan(50);
    }
  });

  test("角色列表应该支持垂直滚动", async ({ page }) => {
    const characterListPage = new CharacterListPage(page);
    await characterListPage.navigate();
    await characterListPage.waitForPageLoad();

    // 滚动到底部
    await characterListPage.scrollToBottom();
    await page.waitForTimeout(500);

    // 验证页面确实滚动了
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test("角色详情页在移动端应该可读", async ({ page }) => {
    const characterDetailPage = new CharacterDetailPage(page);
    await characterDetailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await characterDetailPage.waitForPageLoad();

    // 检查角色名称可见
    const name = await characterDetailPage.getCharacterName();
    expect(name).toBeTruthy();

    // 检查基本信息区域在视口内
    const basicInfoVisible = await isInViewport(
      page,
      '[data-testid="character-header"], h1, .character-name'
    );
    expect(basicInfoVisible).toBeTruthy();
  });

  test("角色详情页内容不应该横向溢出", async ({ page }) => {
    const characterDetailPage = new CharacterDetailPage(page);
    await characterDetailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await characterDetailPage.waitForPageLoad();

    // 检查页面宽度不超过视口
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 393;

    // 允许1px的误差
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("关系图谱在移动端应该可用", async ({ page }) => {
    const characterDetailPage = new CharacterDetailPage(page);
    await characterDetailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await characterDetailPage.waitForPageLoad();

    // 检查关系图谱是否存在
    const hasGraph = await characterDetailPage.hasRelationshipGraph();

    if (hasGraph) {
      // 滚动到关系图谱位置
      await scrollToElement(
        page,
        '[data-testid="relationship-graph"], .relationship-graph, [class*="graph"]'
      );

      // 图谱应该可见
      const graphVisible = await isInViewport(
        page,
        '[data-testid="relationship-graph"], .relationship-graph'
      );
      expect(graphVisible).toBeTruthy();

      // 图谱容器不应该溢出
      const graphContainer = page
        .locator('[data-testid="relationship-graph"], .relationship-graph')
        .first();
      const graphBox = await graphContainer.boundingBox();

      if (graphBox) {
        expect(graphBox.width).toBeLessThanOrEqual(393);
      }
    }
  });

  test("时间线页面在移动端应该流畅滚动", async ({ page }) => {
    await page.goto(ROUTES.TIMELINE);
    await waitForPageStable(page);

    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // 再次滚动
    await page.evaluate(() => window.scrollTo(0, window.scrollY + 500));
    await page.waitForTimeout(300);

    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(scrollY);
  });

  test("图片在移动端应该自适应", async ({ page }) => {
    const characterDetailPage = new CharacterDetailPage(page);
    await characterDetailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await characterDetailPage.waitForPageLoad();

    // 查找页面中的图片
    const images = page
      .locator("img")
      .filter({ hasNot: page.locator('[alt=""]') });
    const imageCount = await images.count();

    if (imageCount > 0) {
      // 检查前3张图片
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        const box = await img.boundingBox();

        if (box) {
          // 图片宽度不应该超过视口宽度
          expect(box.width).toBeLessThanOrEqual(393);
        }
      }
    }
  });

  test("文字在移动端不应该溢出", async ({ page }) => {
    await page.goto(ROUTES.PROJECT);
    await waitForPageStable(page);

    // 检查页面主体内容不溢出
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 393;

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);

    // 检查文本容器
    const textContainers = page
      .locator("p, h1, h2, h3, h4, h5, h6")
      .filter({ hasText: /.+/ });
    const containerCount = await textContainers.count();

    if (containerCount > 0) {
      // 随机检查几个文本容器
      for (
        let i = 0;
        i < Math.min(5, containerCount);
        i += Math.floor(containerCount / 5) || 1
      ) {
        const container = textContainers.nth(i);
        const box = await container.boundingBox();

        if (box) {
          expect(box.width).toBeLessThanOrEqual(393);
        }
      }
    }
  });

  test("导航栏在移动端应该固定且可访问", async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageStable(page);

    // 查找导航栏
    const nav = page.locator("nav, header").first();
    await expect(nav).toBeVisible();

    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // 导航栏应该仍然可见（如果是固定定位）
    const isNavVisible = await nav.isVisible();
    expect(isNavVisible).toBeTruthy();
  });

  test("表单输入在移动端应该可用（如果有）", async ({ page }) => {
    await page.goto(ROUTES.JOIN);
    await waitForPageStable(page);

    // 查找输入框
    const inputs = page
      .locator("input, textarea")
      .filter({ hasNot: page.locator('[type="hidden"]') });
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();
      await firstInput.click();

      // 输入框应该获得焦点
      const isFocused = await firstInput.evaluate(
        (el) => el === document.activeElement
      );
      expect(isFocused).toBeTruthy();

      // 尝试输入文本
      await firstInput.fill("测试文本");
      const value = await firstInput.inputValue();
      expect(value).toBe("测试文本");
    }
  });

  test("触摸目标应该足够大（至少44x44px）", async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageStable(page);

    // 查找所有可点击的元素
    const clickables = page
      .locator("button, a[href], [role='button']")
      .filter({ hasText: /.+/ });
    const clickableCount = await clickables.count();

    if (clickableCount > 0) {
      let smallTargets = 0;

      for (let i = 0; i < Math.min(10, clickableCount); i++) {
        const element = clickables.nth(i);
        const box = await element.boundingBox();

        if (box && (box.width < 44 || box.height < 44)) {
          smallTargets++;
        }
      }

      // 大部分触摸目标应该符合尺寸要求
      expect(smallTargets).toBeLessThan(clickableCount / 2);
    }
  });

  test("移动端页面加载性能应该可接受", async ({ page }) => {
    const startTime = Date.now();

    await page.goto(ROUTES.CHARACTERS);
    await waitForPageStable(page);

    const loadTime = Date.now() - startTime;

    // 页面应该在10秒内加载完成（移动端可能较慢）
    expect(loadTime).toBeLessThan(10000);
  });

  test("平板尺寸下布局应该适配", async ({ page }) => {
    // 设置平板尺寸
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(ROUTES.CHARACTERS);
    await waitForPageStable(page);

    // 页面应该正常加载
    const title = await page.title();
    expect(title).toBeTruthy();

    // 内容不应该溢出
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768 + 1);
  });
});
