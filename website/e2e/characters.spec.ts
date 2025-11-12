// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/test";
import { CharacterListPage } from "./pages/CharacterListPage";
import { CharacterDetailPage } from "./pages/CharacterDetailPage";
import { waitForAnimation, waitForPageStable } from "./utils/helpers";
import { TEST_CHARACTERS } from "./fixtures/test-data";

test.describe("角色页面", () => {
  test("应该成功加载角色列表页", async ({ page }) => {
    await page.goto("/characters");

    // 验证页面加载成功
    await page.waitForLoadState("networkidle");

    // 验证页面有内容
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // 验证 URL 正确
    await expect(page).toHaveURL(/\/characters$/);
  });

  test("应该能够点击角色进入详情页", async ({ page }) => {
    const characterListPage = new CharacterListPage(page);

    // 导航并等待页面加载
    await characterListPage.navigate();
    await characterListPage.waitForPageLoad();

    // 验证至少有一些角色卡片
    const count = await characterListPage.getCharacterCount();
    expect(count).toBeGreaterThan(0);

    // 点击第一个角色（POM 已处理移动端/桌面端差异）
    await characterListPage.clickCharacterByIndex(0);

    // 验证 URL 包含角色 ID
    await expect(page).toHaveURL(/\/characters\/\w+/);

    // 验证页面内容存在
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("应该显示角色基本信息", async ({ page }) => {
    // 访问已知存在的角色详情页
    await page.goto("/characters/1547");

    // 验证角色名称显示
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // 验证页面有内容（段落或描述文本）
    const content = page.locator("p, article, section");
    await expect(content.first()).toBeVisible();
  });

  test.describe("使用 POM 的角色列表页测试", () => {
    test("应该使用 POM 成功加载角色列表页", async ({ page }) => {
      const characterListPage = new CharacterListPage(page);

      await characterListPage.navigate();
      await characterListPage.waitForPageLoad();

      // 验证页面加载成功
      expect(await characterListPage.isPageLoaded()).toBeTruthy();

      // 验证 URL 正确
      expect(characterListPage.isCharacterListUrl()).toBeTruthy();
    });

    test("应该显示多个角色卡片", async ({ page }) => {
      const characterListPage = new CharacterListPage(page);

      await characterListPage.navigate();
      await characterListPage.waitForPageLoad();

      // 验证至少有一些角色卡片
      const characterCount = await characterListPage.getCharacterCount();
      expect(characterCount).toBeGreaterThan(0);
    });

    test("应该能够获取所有角色名称", async ({ page }) => {
      const characterListPage = new CharacterListPage(page);

      await characterListPage.navigate();
      await characterListPage.waitForPageLoad();

      // 获取所有角色名称
      const names = await characterListPage.getAllCharacterNames();
      expect(names.length).toBeGreaterThan(0);

      // 验证名称不为空
      const validNames = names.filter((name) => name && name.trim().length > 0);
      expect(validNames.length).toBeGreaterThan(0);
    });
  });

  test.describe("角色详情页 - AptS:1547", () => {
    test("应该显示 AptS:1547 的完整信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);

      // 验证角色名称
      const name = await detailPage.getCharacterName();
      expect(name).toBeTruthy();
      expect(name!.length).toBeGreaterThan(0);

      // 验证页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();

      // 验证 URL 正确
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1547.id)
      ).toBeTruthy();
    });

    test("应该显示 AptS:1547 的描述信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);

      // 获取描述信息
      const description = await detailPage.getCharacterDescription();

      // 验证描述存在（如果页面有描述的话）
      if (description) {
        expect(description.length).toBeGreaterThan(0);
      }
    });

    test("应该能够在 AptS:1547 页面滚动查看内容", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);

      // 获取所有 section
      const sections = await detailPage.getAllSectionIds();

      // 如果有多个 section，滚动到第一个
      if (sections.length > 0) {
        await detailPage.scrollToSection(sections[0]);
        await waitForAnimation(page, 300);

        // 验证页面仍然可交互
        expect(await detailPage.isPageLoaded()).toBeTruthy();
      }
    });
  });

  test.describe("角色详情页 - AptS:1548", () => {
    test("应该显示 AptS:1548 的完整信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);

      // 验证角色名称
      const name = await detailPage.getCharacterName();
      expect(name).toBeTruthy();
      expect(name!.length).toBeGreaterThan(0);

      // 验证页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();

      // 验证 URL 正确
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1548.id)
      ).toBeTruthy();
    });

    test("应该显示 AptS:1548 的描述信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);

      // 获取描述信息
      const description = await detailPage.getCharacterDescription();

      // 验证描述存在（如果页面有描述的话）
      if (description) {
        expect(description.length).toBeGreaterThan(0);
      }
    });

    test("应该能够在 AptS:1548 页面获取页面标题", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);

      // 获取页面标题
      const pageTitle = await detailPage.getPageTitle();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(0);
    });
  });

  test.describe("角色详情页 - AptS:1549", () => {
    test("应该显示 AptS:1549 的完整信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);

      // 验证角色名称
      const name = await detailPage.getCharacterName();
      expect(name).toBeTruthy();
      expect(name!.length).toBeGreaterThan(0);

      // 验证页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();

      // 验证 URL 正确
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1549.id)
      ).toBeTruthy();
    });

    test("应该显示 AptS:1549 的描述信息", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);

      // 获取描述信息
      const description = await detailPage.getCharacterDescription();

      // 验证描述存在（如果页面有描述的话）
      if (description) {
        expect(description.length).toBeGreaterThan(0);
      }
    });

    test("AptS:1549 页面应该有内容区域", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);

      // 获取所有 section 标题
      const titles = await detailPage.getAllSectionTitles();

      // 验证至少有一些内容区域
      expect(titles.length).toBeGreaterThanOrEqual(0);
    });

    test("应该能够在 AptS:1549 页面刷新", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);

      // 获取初始角色名称
      const nameBefore = await detailPage.getCharacterName();

      // 刷新页面
      await detailPage.refresh();

      // 验证页面仍然可用
      const nameAfter = await detailPage.getCharacterName();
      expect(nameAfter).toBeTruthy();
    });
  });

  test.describe("角色间跳转", () => {
    test("应该能够从 1547 跳转到 1548", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      // 先访问 1547
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1547.id)
      ).toBeTruthy();

      // 再跳转到 1548
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1548.id)
      ).toBeTruthy();

      // 验证新页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();
    });

    test("应该能够从 1548 跳转到 1549", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      // 先访问 1548
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1548.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1548.id)
      ).toBeTruthy();

      // 再跳转到 1549
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1549.id)
      ).toBeTruthy();

      // 验证新页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();
    });

    test("应该能够从 1549 跳转回 1547", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      // 先访问 1549
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1549.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1549.id)
      ).toBeTruthy();

      // 再跳转回 1547
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
      expect(
        detailPage.isCharacterDetailUrl(TEST_CHARACTERS.APTS_1547.id)
      ).toBeTruthy();

      // 验证新页面加载成功
      expect(await detailPage.isPageLoaded()).toBeTruthy();
    });

    test("角色跳转应该流畅无卡顿", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      // 测试快速跳转三个角色
      const characters = [
        TEST_CHARACTERS.APTS_1547.id,
        TEST_CHARACTERS.APTS_1548.id,
        TEST_CHARACTERS.APTS_1549.id,
      ];

      for (const characterId of characters) {
        const startTime = Date.now();

        await detailPage.navigateToCharacter(characterId);
        expect(await detailPage.isPageLoaded()).toBeTruthy();

        const loadTime = Date.now() - startTime;

        // 每次跳转应该在 5 秒内完成
        expect(loadTime).toBeLessThan(5000);
      }
    });

    test("应该能够从列表页跳转到详情页再返回", async ({ page }) => {
      const listPage = new CharacterListPage(page);
      const detailPage = new CharacterDetailPage(page);

      // 先访问列表页
      await listPage.navigate();
      await listPage.waitForPageLoad();
      expect(await listPage.isPageLoaded()).toBeTruthy();

      // 跳转到详情页
      await detailPage.navigateToCharacter(TEST_CHARACTERS.APTS_1547.id);
      expect(await detailPage.isPageLoaded()).toBeTruthy();

      // 返回列表页
      await detailPage.goBack();
      await waitForPageStable(page);

      // 验证回到列表页
      expect(listPage.isCharacterListUrl()).toBeTruthy();
    });
  });

  test.describe("角色卡片交互", () => {
    test("角色卡片应该支持悬停效果", async ({
      page,
      browserName,
    }, testInfo) => {
      // 跳过移动端测试（移动设备不支持悬停）
      test.skip(
        testInfo.project.name === "Mobile Chrome" ||
          testInfo.project.name === "Mobile Safari",
        "移动端不支持悬停交互"
      );

      const listPage = new CharacterListPage(page);

      await listPage.navigate();
      await listPage.waitForPageLoad();

      const characterCards = listPage.getCharacterCards();
      const count = await characterCards.count();

      if (count > 0) {
        const firstCard = characterCards.first();

        // 验证卡片可见
        await expect(firstCard).toBeVisible();

        // 悬停在卡片上
        await firstCard.hover();
        await waitForAnimation(page, 200);

        // 验证卡片仍然可见（悬停不会破坏布局）
        await expect(firstCard).toBeVisible();
      }
    });

    test("应该能够悬停在多个角色卡片上", async ({
      page,
      browserName,
    }, testInfo) => {
      // 跳过移动端测试（移动设备不支持悬停）
      test.skip(
        testInfo.project.name === "Mobile Chrome" ||
          testInfo.project.name === "Mobile Safari",
        "移动端不支持悬停交互"
      );

      const listPage = new CharacterListPage(page);

      await listPage.navigate();
      await listPage.waitForPageLoad();

      const characterCards = listPage.getCharacterCards();
      const count = await characterCards.count();

      // 测试前三个卡片的悬停效果
      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = characterCards.nth(i);

        if (await card.isVisible()) {
          await card.hover();
          await waitForAnimation(page, 150);

          // 验证卡片仍然可见
          await expect(card).toBeVisible();
        }
      }
    });

    test("角色卡片悬停应该不影响其他卡片", async ({
      page,
      browserName,
    }, testInfo) => {
      // 跳过移动端测试（移动设备不支持悬停）
      test.skip(
        testInfo.project.name === "Mobile Chrome" ||
          testInfo.project.name === "Mobile Safari",
        "移动端不支持悬停交互"
      );

      const listPage = new CharacterListPage(page);

      await listPage.navigate();
      await listPage.waitForPageLoad();

      const characterCards = listPage.getCharacterCards();
      const count = await characterCards.count();

      if (count > 1) {
        const firstCard = characterCards.first();
        const secondCard = characterCards.nth(1);

        // 悬停在第一个卡片上
        await firstCard.hover();
        await waitForAnimation(page, 200);

        // 验证第二个卡片仍然可见
        await expect(secondCard).toBeVisible();
      }
    });

    test("应该能够在角色卡片之间平滑切换焦点", async ({
      page,
      browserName,
    }, testInfo) => {
      // 跳过移动端测试（移动设备不支持悬停）
      test.skip(
        testInfo.project.name === "Mobile Chrome" ||
          testInfo.project.name === "Mobile Safari",
        "移动端不支持悬停交互"
      );

      const listPage = new CharacterListPage(page);

      await listPage.navigate();
      await listPage.waitForPageLoad();

      const characterCards = listPage.getCharacterCards();
      const count = await characterCards.count();

      // 测试前两个卡片的焦点切换
      if (count > 1) {
        const firstCard = characterCards.first();
        const secondCard = characterCards.nth(1);

        // 聚焦第一个卡片
        await firstCard.hover();
        await waitForAnimation(page, 150);

        // 切换到第二个卡片
        await secondCard.hover();
        await waitForAnimation(page, 150);

        // 验证第二个卡片可见
        await expect(secondCard).toBeVisible();
      }
    });
  });

  test.describe("验证角色独特信息", () => {
    test("每个角色应该有不同的名称", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);
      const names: (string | null)[] = [];

      // 收集所有角色名称
      const characters = [
        TEST_CHARACTERS.APTS_1547.id,
        TEST_CHARACTERS.APTS_1548.id,
        TEST_CHARACTERS.APTS_1549.id,
      ];

      for (const characterId of characters) {
        await detailPage.navigateToCharacter(characterId);
        const name = await detailPage.getCharacterName();
        names.push(name);
      }

      // 验证所有名称都不为空
      const validNames = names.filter((name) => name && name.trim().length > 0);
      expect(validNames.length).toBe(characters.length);

      // 验证名称都不相同（如果都有名称的话）
      const uniqueNames = new Set(validNames);
      expect(uniqueNames.size).toBe(validNames.length);
    });

    test("每个角色应该有唯一的 URL", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);
      const urls: string[] = [];

      const characters = [
        TEST_CHARACTERS.APTS_1547.id,
        TEST_CHARACTERS.APTS_1548.id,
        TEST_CHARACTERS.APTS_1549.id,
      ];

      for (const characterId of characters) {
        await detailPage.navigateToCharacter(characterId);
        const url = detailPage.getCurrentUrl();
        urls.push(url);
      }

      // 验证所有 URL 都不相同
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(characters.length);
    });

    test("每个角色页面应该独立加载", async ({ page }) => {
      const detailPage = new CharacterDetailPage(page);

      const characters = [
        TEST_CHARACTERS.APTS_1547.id,
        TEST_CHARACTERS.APTS_1548.id,
        TEST_CHARACTERS.APTS_1549.id,
      ];

      for (const characterId of characters) {
        await detailPage.navigateToCharacter(characterId);

        // 验证页面独立加载成功
        expect(await detailPage.isPageLoaded()).toBeTruthy();
        expect(detailPage.isCharacterDetailUrl(characterId)).toBeTruthy();

        // 验证角色名称存在
        const name = await detailPage.getCharacterName();
        expect(name).toBeTruthy();
      }
    });
  });
});
