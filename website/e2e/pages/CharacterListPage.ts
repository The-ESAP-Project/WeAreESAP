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

import { Page, Locator } from "@playwright/test";
import {
  navigateAndWait,
  waitForPageStable,
  waitForAnimation,
} from "../utils/helpers";
import { ROUTES, SELECTORS, TIMEOUTS } from "../fixtures/test-data";

/**
 * 角色列表页面对象模型
 * 封装与角色列表页面交互的所有方法
 */
export class CharacterListPage {
  readonly page: Page;
  readonly characterGrid: Locator;
  readonly characterCards: Locator;
  readonly loadingSpinner: Locator;

  /**
   * 初始化页面对象
   * @param page Playwright 页面对象
   */
  constructor(page: Page) {
    this.page = page;
    this.characterGrid = page.locator(SELECTORS.CHARACTER_GRID);
    // 只选择可见的角色卡片（过滤掉被 CSS 隐藏的桌面端/移动端元素）
    this.characterCards = page
      .locator(SELECTORS.CHARACTER_CARD)
      .locator("visible=true");
    this.loadingSpinner = page.locator(SELECTORS.LOADING_SPINNER);
  }

  /**
   * 导航到角色列表页
   * @param locale 可选的语言代码（zh、en、ja）
   */
  async navigate(locale?: string): Promise<void> {
    let url: string = ROUTES.CHARACTERS;

    // 如果指定了语言，使用语言特定的路由
    if (locale) {
      const localeRoutes: Record<string, string> = {
        zh: ROUTES.ZH_CHARACTERS,
        en: ROUTES.EN_CHARACTERS,
        ja: ROUTES.JA_CHARACTERS,
      };
      url = localeRoutes[locale] || ROUTES.CHARACTERS;
    }

    await navigateAndWait(this.page, url);
  }

  /**
   * 等待页面加载完成
   * 包括：网络请求完成、DOM 加载、动画完成
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForLoadState("domcontentloaded");

    // 等待角色卡片加载完成（移动端和桌面端都有）
    // 只检查attached状态，因为在移动端桌面端卡片可见性不同
    await this.page.locator(SELECTORS.CHARACTER_CARD).first().waitFor({
      state: "attached",
      timeout: TIMEOUTS.MEDIUM,
    });

    // 等待加载状态消失
    const loadingExists = await this.loadingSpinner.count();
    if (loadingExists > 0) {
      await this.loadingSpinner.waitFor({ state: "hidden" });
    }

    // 等待页面稳定
    await waitForPageStable(this.page);
  }

  /**
   * 获取所有角色卡片
   * @returns 角色卡片 Locator 对象
   */
  getCharacterCards(): Locator {
    return this.characterCards;
  }

  /**
   * 获取角色数量
   * @returns 角色卡片数量
   */
  async getCharacterCount(): Promise<number> {
    return await this.characterCards.count();
  }

  /**
   * 按索引点击指定角色
   * @param index 角色在列表中的索引（从 0 开始）
   */
  async clickCharacterByIndex(index: number): Promise<void> {
    const card = this.characterCards.nth(index);

    // 确保卡片在视口内
    await card.scrollIntoViewIfNeeded();

    // 检测是否为移动端（< 768px）
    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    if (isMobile) {
      // 移动端：CharacterMobileView 使用折叠卡片
      // 第一次点击展开，第二次点击跳转详情页
      await card.click();
      await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
      await card.click();
    } else {
      // 桌面端：CharacterCard/CharacterAccordion 直接跳转
      await card.click();
    }

    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
  }

  /**
   * 按角色名称点击指定角色
   * @param characterName 角色名称（支持部分匹配）
   */
  async clickCharacterByName(characterName: string): Promise<void> {
    const characterCard = this.characterCards.filter({
      has: this.page.locator(SELECTORS.CHARACTER_NAME),
    });

    // 检测是否为移动端
    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    // 查找包含指定名称的卡片
    for (let i = 0; i < (await characterCard.count()); i++) {
      const card = characterCard.nth(i);
      const name = await card.locator(SELECTORS.CHARACTER_NAME).textContent();

      if (name?.includes(characterName)) {
        // 确保卡片在视口内
        await card.scrollIntoViewIfNeeded();

        if (isMobile) {
          // 移动端：第一次展开，第二次跳转
          await card.click();
          await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
          await card.click();
        } else {
          // 桌面端：直接跳转
          await card.click();
        }

        await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
        return;
      }
    }

    throw new Error(`未找到名称为 "${characterName}" 的角色`);
  }

  /**
   * 按角色代码点击指定角色
   * @param characterCode 角色代码（如 "AptS:1547"）
   */
  async clickCharacterByCode(characterCode: string): Promise<void> {
    const characterCard = this.characterCards.filter({
      has: this.page.locator(SELECTORS.CHARACTER_CODE),
    });

    // 检测是否为移动端
    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    // 查找包含指定代码的卡片
    for (let i = 0; i < (await characterCard.count()); i++) {
      const card = characterCard.nth(i);
      const code = await card.locator(SELECTORS.CHARACTER_CODE).textContent();

      if (code?.includes(characterCode)) {
        // 确保卡片在视口内
        await card.scrollIntoViewIfNeeded();

        if (isMobile) {
          // 移动端：第一次展开，第二次跳转
          await card.click();
          await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
          await card.click();
        } else {
          // 桌面端：直接跳转
          await card.click();
        }

        await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
        return;
      }
    }

    throw new Error(`未找到代码为 "${characterCode}" 的角色`);
  }

  /**
   * 搜索角色（如果页面有搜索功能）
   * @param searchQuery 搜索关键词
   */
  async searchCharacter(searchQuery: string): Promise<void> {
    // 查找搜索输入框（常见的 data-testid 或 placeholder）
    const searchInput = this.page.locator(
      'input[type="search"], input[placeholder*="搜索"], input[placeholder*="search"]'
    );

    if ((await searchInput.count()) === 0) {
      throw new Error("页面上未找到搜索输入框");
    }

    // 清空搜索框并输入搜索词
    await searchInput.first().clear();
    await searchInput.first().fill(searchQuery);
    await searchInput.first().press("Enter");

    // 等待搜索结果加载
    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
    await waitForPageStable(this.page);
  }

  /**
   * 清除搜索
   */
  async clearSearch(): Promise<void> {
    const searchInput = this.page.locator(
      'input[type="search"], input[placeholder*="搜索"], input[placeholder*="search"]'
    );

    if ((await searchInput.count()) > 0) {
      await searchInput.first().clear();
      await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
      await waitForPageStable(this.page);
    }
  }

  /**
   * 验证页面是否成功加载
   * @returns 页面是否加载成功
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      const gridExists = await this.characterGrid.count();
      const cardsExist = await this.characterCards.count();
      return gridExists > 0 && cardsExist > 0;
    } catch {
      return false;
    }
  }

  /**
   * 获取指定角色卡片的文本内容
   * @param index 角色在列表中的索引
   * @returns 角色卡片的文本内容
   */
  async getCharacterCardText(index: number): Promise<string | null> {
    const card = this.characterCards.nth(index);
    return await card.textContent();
  }

  /**
   * 获取指定角色的名称
   * @param index 角色在列表中的索引
   * @returns 角色名称
   */
  async getCharacterName(index: number): Promise<string | null> {
    const card = this.characterCards.nth(index);
    return await card.locator(SELECTORS.CHARACTER_NAME).textContent();
  }

  /**
   * 获取指定角色的代码
   * @param index 角色在列表中的索引
   * @returns 角色代码
   */
  async getCharacterCode(index: number): Promise<string | null> {
    const card = this.characterCards.nth(index);
    return await card.locator(SELECTORS.CHARACTER_CODE).textContent();
  }

  /**
   * 获取所有角色的名称列表
   * @returns 角色名称数组
   */
  async getAllCharacterNames(): Promise<(string | null)[]> {
    const count = await this.getCharacterCount();
    const names: (string | null)[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.getCharacterName(i);
      names.push(name);
    }

    return names;
  }

  /**
   * 获取所有角色的代码列表
   * @returns 角色代码数组
   */
  async getAllCharacterCodes(): Promise<(string | null)[]> {
    const count = await this.getCharacterCount();
    const codes: (string | null)[] = [];

    for (let i = 0; i < count; i++) {
      const code = await this.getCharacterCode(i);
      codes.push(code);
    }

    return codes;
  }

  /**
   * 滚动到底部加载更多角色（如果有分页或无限滚动）
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
    await waitForPageStable(this.page);
  }

  /**
   * 滚动到顶部
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
  }

  /**
   * 检查角色卡片是否可见
   * @param index 角色在列表中的索引
   * @returns 是否可见
   */
  async isCharacterCardVisible(index: number): Promise<boolean> {
    const card = this.characterCards.nth(index);
    return await card.isVisible();
  }

  /**
   * 检查角色卡片是否在视口中
   * @param index 角色在列表中的索引
   * @returns 是否在视口中
   */
  async isCharacterCardInViewport(index: number): Promise<boolean> {
    const card = this.characterCards.nth(index);
    const isVisible = await card.isVisible();
    const boundingBox = await card.boundingBox();
    return isVisible && boundingBox !== null;
  }

  /**
   * 获取当前页面 URL
   * @returns 当前 URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * 验证当前页面 URL 是否为角色列表页
   * @returns 是否为角色列表页
   */
  isCharacterListUrl(): boolean {
    const url = this.page.url();
    return (
      /\/characters\/?$/.test(url) || /\/[\w]{2}\/characters\/?$/.test(url)
    );
  }
}
