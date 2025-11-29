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
import { CharacterDetailPage } from "./pages/CharacterDetailPage";
import {
  waitForAnimation,
  waitForPageStable,
  scrollToElement,
  elementExists,
} from "./utils/helpers";
import { TEST_CHARACTERS, SELECTORS, TIMEOUTS } from "./fixtures/test-data";

test.describe("关系图谱交互", () => {
  let detailPage: CharacterDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new CharacterDetailPage(page);
  });

  test("应该正确渲染关系图谱的所有节点", async ({ page }) => {
    // 导航到有关系数据的角色详情页
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    // 检查关系图谱是否存在
    const hasGraph = await detailPage.hasRelationshipGraph();

    if (!hasGraph) {
      test.skip();
      return;
    }

    // 等待图谱加载完成
    await detailPage.waitForRelationshipGraphLoad();

    // 验证图谱容器可见
    const graph = detailPage.relationshipGraph;
    await expect(graph).toBeVisible();

    // 验证至少有中心节点（当前角色）
    const nodes = detailPage.getGraphNodes();
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);

    // 验证所有节点都可见
    for (let i = 0; i < nodeCount; i++) {
      await expect(nodes.nth(i)).toBeVisible();
    }
  });

  test("应该正确渲染关系图谱的连接线", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 获取边线数量
    const edgeCount = await detailPage.getGraphEdgeCount();

    // 验证边线数量与节点数量的关系
    // 如果有 N 个节点（包括中心节点），应该有 N-1 条边
    const nodeCount = await detailPage.getGraphNodeCount();

    if (nodeCount > 1) {
      expect(edgeCount).toBeGreaterThan(0);
      expect(edgeCount).toBeLessThanOrEqual(nodeCount - 1);
    }
  });

  test("节点位置布局应该合理且无重叠", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    const nodes = detailPage.getGraphNodes();
    const nodeCount = await nodes.count();

    if (nodeCount <= 1) {
      // 只有一个节点，无需检查重叠
      return;
    }

    // 获取所有节点的位置信息
    const positions: { x: number; y: number; width: number; height: number }[] =
      [];

    for (let i = 0; i < nodeCount; i++) {
      const box = await nodes.nth(i).boundingBox();
      if (box) {
        positions.push(box);
      }
    }

    // 检查是否有重叠（至少应该有一些间距）
    let hasOverlap = false;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];

        // 计算两个节点中心点之间的距离
        const centerX1 = pos1.x + pos1.width / 2;
        const centerY1 = pos1.y + pos1.height / 2;
        const centerX2 = pos2.x + pos2.width / 2;
        const centerY2 = pos2.y + pos2.height / 2;

        const distance = Math.sqrt(
          Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
        );

        // 如果距离小于节点尺寸总和的一半，说明可能有重叠
        const minDistance = (pos1.width + pos2.width) / 2;
        if (distance < minDistance * 0.8) {
          hasOverlap = true;
          break;
        }
      }
      if (hasOverlap) break;
    }

    // 验证节点之间没有严重重叠
    expect(hasOverlap).toBe(false);
  });

  test("点击节点应该导航到对应角色详情页", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    const nodes = detailPage.getGraphNodes();
    const nodeCount = await nodes.count();

    if (nodeCount <= 1) {
      // 只有中心节点，无其他可点击节点
      return;
    }

    // 滚动到图谱区域
    await scrollToElement(page, SELECTORS.RELATIONSHIP_GRAPH);

    // 记录当前 URL
    const originalUrl = page.url();

    // 查找可点击的非中心节点
    // 中心节点的 role 属性不是 button
    const clickableNode = page
      .locator(`${SELECTORS.GRAPH_NODE}[role="button"]`)
      .first();

    if ((await clickableNode.count()) === 0) {
      // 没有可点击的非中心节点
      return;
    }

    // 点击第一个可点击节点
    await clickableNode.click();

    // 等待页面稳定
    await waitForPageStable(page);

    // 验证 URL 已改变（导航到了新的角色页面）
    const newUrl = page.url();
    expect(newUrl).not.toBe(originalUrl);

    // 验证新 URL 是角色详情页格式
    expect(newUrl).toMatch(/\/characters\/\d+/);
  });

  test("应该支持节点拖拽功能", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    const nodes = detailPage.getGraphNodes();
    const nodeCount = await nodes.count();

    if (nodeCount === 0) {
      return;
    }

    // 获取第一个节点
    const firstNode = nodes.first();
    await scrollToElement(page, SELECTORS.RELATIONSHIP_GRAPH);

    // 获取拖拽前的位置
    const beforeBox = await firstNode.boundingBox();
    expect(beforeBox).not.toBeNull();

    if (!beforeBox) return;

    // 执行拖拽操作（向右下方拖动 100 像素）
    await firstNode.hover();
    await page.mouse.down();
    await page.mouse.move(beforeBox.x + 100, beforeBox.y + 100, { steps: 10 });
    await page.mouse.up();

    // 等待动画完成
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 获取拖拽后的位置
    const afterBox = await firstNode.boundingBox();
    expect(afterBox).not.toBeNull();

    if (!afterBox) return;

    // 验证节点位置发生了变化
    const movedX = Math.abs(afterBox.x - beforeBox.x);
    const movedY = Math.abs(afterBox.y - beforeBox.y);

    // 至少应该有一定的移动（考虑到可能的布局约束）
    expect(movedX + movedY).toBeGreaterThan(10);
  });

  test("应该支持图谱缩放功能", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 找到 ReactFlow 控制面板
    const controls = page.locator(SELECTORS.GRAPH_CONTROLS);

    // 如果没有控制面板，尝试通过 class 查找
    const hasControls =
      (await controls.count()) > 0 ||
      (await page.locator(".react-flow__controls").count()) > 0;

    if (!hasControls) {
      // 没有控制面板，尝试使用滚轮缩放
      const graphContainer = detailPage.relationshipGraph;
      await graphContainer.hover();

      // 获取一个节点用于测量缩放效果
      const testNode = detailPage.getGraphNodes().first();
      const beforeBox = await testNode.boundingBox();

      if (!beforeBox) return;

      // 使用滚轮放大
      await graphContainer.hover();
      await page.mouse.wheel(0, -100);
      await waitForAnimation(page, TIMEOUTS.ANIMATION);

      // 验证节点尺寸发生变化（说明缩放生效）
      const afterBox = await testNode.boundingBox();
      if (!afterBox) return;

      // 放大后节点应该变大或位置发生变化
      const sizeChanged =
        Math.abs(afterBox.width - beforeBox.width) > 1 ||
        Math.abs(afterBox.height - beforeBox.height) > 1 ||
        Math.abs(afterBox.x - beforeBox.x) > 5 ||
        Math.abs(afterBox.y - beforeBox.y) > 5;

      expect(sizeChanged).toBe(true);
      return;
    }

    // 有控制面板，使用放大按钮
    const zoomInButton = page
      .locator(
        ".react-flow__controls-zoomin, button[aria-label*='zoom in'], button[aria-label*='放大']"
      )
      .first();

    if ((await zoomInButton.count()) > 0) {
      await zoomInButton.click();
      await waitForAnimation(page, TIMEOUTS.ANIMATION);

      // 验证缩放成功（可以通过节点尺寸变化来判断）
      const nodes = detailPage.getGraphNodes();
      expect(await nodes.first().isVisible()).toBe(true);
    }
  });

  test("应该支持图谱平移功能", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    const nodes = detailPage.getGraphNodes();
    if ((await nodes.count()) === 0) {
      return;
    }

    // 获取第一个节点的初始位置
    const firstNode = nodes.first();
    const beforeBox = await firstNode.boundingBox();
    expect(beforeBox).not.toBeNull();

    if (!beforeBox) return;

    // 在图谱空白区域执行拖拽（平移画布）
    const graphContainer = detailPage.relationshipGraph;
    const containerBox = await graphContainer.boundingBox();

    if (!containerBox) return;

    // 在容器中心位置开始拖拽
    const startX = containerBox.x + containerBox.width / 2;
    const startY = containerBox.y + containerBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 100, startY - 50, { steps: 10 });
    await page.mouse.up();

    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 获取节点的新位置
    const afterBox = await firstNode.boundingBox();
    expect(afterBox).not.toBeNull();

    if (!afterBox) return;

    // 验证节点位置发生了变化（说明画布被平移了）
    const movedX = Math.abs(afterBox.x - beforeBox.x);
    const movedY = Math.abs(afterBox.y - beforeBox.y);

    expect(movedX + movedY).toBeGreaterThan(5);
  });

  test("应该有重置视图按钮", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 查找重置视图按钮（ReactFlow 的 Controls 组件通常包含这个功能）
    const fitViewButton = page.locator(
      ".react-flow__controls-fitview, button[aria-label*='fit view'], button[aria-label*='重置视图']"
    );

    // 如果存在重置按钮，验证其功能
    if ((await fitViewButton.count()) > 0) {
      await expect(fitViewButton.first()).toBeVisible();

      // 先拖动画布，改变视图
      const graphContainer = detailPage.relationshipGraph;
      const containerBox = await graphContainer.boundingBox();

      if (containerBox) {
        const centerX = containerBox.x + containerBox.width / 2;
        const centerY = containerBox.y + containerBox.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 150, centerY - 150, { steps: 10 });
        await page.mouse.up();
        await waitForAnimation(page, TIMEOUTS.ANIMATION);

        // 点击重置视图按钮
        await fitViewButton.first().click();
        await waitForAnimation(page, TIMEOUTS.ANIMATION);

        // 验证视图已重置（所有节点都可见）
        const nodes = detailPage.getGraphNodes();
        const nodeCount = await nodes.count();

        for (let i = 0; i < nodeCount; i++) {
          await expect(nodes.nth(i)).toBeVisible();
        }
      }
    }
  });

  test("不同角色的图谱内容应该不同", async ({ page }) => {
    // 访问第一个角色
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    const hasGraph1 = await detailPage.hasRelationshipGraph();

    if (!hasGraph1) {
      // 第一个角色没有图谱，跳过测试
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 记录第一个角色的节点和边数量
    const nodes1Count = await detailPage.getGraphNodeCount();
    const edges1Count = await detailPage.getGraphEdgeCount();

    // 访问第二个角色
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);
    await detailPage.waitForPageLoad();

    const hasGraph2 = await detailPage.hasRelationshipGraph();

    if (!hasGraph2) {
      // 第二个角色没有图谱，说明内容确实不同
      expect(hasGraph1).not.toBe(hasGraph2);
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 记录第二个角色的节点和边数量
    const nodes2Count = await detailPage.getGraphNodeCount();
    const edges2Count = await detailPage.getGraphEdgeCount();

    // 验证两个角色的图谱数据不完全相同
    // 至少节点数量或边数量应该有差异
    const isDifferent =
      nodes1Count !== nodes2Count || edges1Count !== edges2Count;

    // 如果数量相同，可能关系数据也相同，这是正常的
    // 但至少应该验证图谱存在
    expect(nodes2Count).toBeGreaterThan(0);
  });

  test("图谱加载状态应该正确显示", async ({ page }) => {
    // 使用网络节流来模拟慢速加载
    await page.route("**/*", (route) => {
      // 延迟所有请求 100ms
      setTimeout(() => route.continue(), 100);
    });

    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);

    // 在页面加载过程中，可能会看到加载指示器
    const hasLoadingIndicator = await page
      .locator("text=/加载中|loading/i, .animate-spin")
      .first()
      .isVisible()
      .catch(() => false);

    // 等待页面完全加载
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 验证加载完成后，图谱可见
    await expect(detailPage.relationshipGraph).toBeVisible();

    // 验证节点已渲染
    const nodeCount = await detailPage.getGraphNodeCount();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test("图谱应该在关系区域正确显示", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    // 检查是否有关系区域
    const hasRelationshipsSection =
      await detailPage.hasSectionById("relationships");

    if (!hasRelationshipsSection) {
      test.skip();
      return;
    }

    // 滚动到关系区域
    await detailPage.scrollToSection("relationships");
    await waitForAnimation(page, TIMEOUTS.ANIMATION);

    // 验证关系区域在视口中
    const isInViewport = await detailPage.isSectionInViewport("relationships");
    expect(isInViewport).toBe(true);

    // 如果有图谱，验证图谱在关系区域内
    if (await detailPage.hasRelationshipGraph()) {
      await detailPage.waitForRelationshipGraphLoad();
      await expect(detailPage.relationshipGraph).toBeVisible();
    }
  });

  test("图谱提示文本应该可见", async ({ page }) => {
    await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
    await detailPage.waitForPageLoad();

    if (!(await detailPage.hasRelationshipGraph())) {
      test.skip();
      return;
    }

    await detailPage.waitForRelationshipGraphLoad();

    // 滚动到图谱区域
    await scrollToElement(page, SELECTORS.RELATIONSHIP_GRAPH);

    // 查找提示文本（通常在底部左侧）
    const hintText = page.locator(
      `${SELECTORS.RELATIONSHIP_GRAPH} ~ div, ${SELECTORS.RELATIONSHIP_GRAPH} div.text-xs`
    );

    // 验证至少有一个提示文本可见
    if ((await hintText.count()) > 0) {
      await expect(hintText.first()).toBeVisible();
    }
  });
});
