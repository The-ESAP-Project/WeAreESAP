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
  scrollToElement,
  waitForElementVisible,
  waitForAnimation,
  elementExists,
} from "../utils/helpers";
import { ROUTES, SELECTORS, TIMEOUTS } from "../fixtures/test-data";

/**
 * 角色详情页面对象模型
 * 封装与角色详情页面交互的所有方法
 */
export class CharacterDetailPage {
  readonly page: Page;
  readonly characterHeader: Locator;
  readonly basicInfo: Locator;
  readonly relationshipGraph: Locator;
  readonly loadingSpinner: Locator;

  /**
   * 初始化页面对象
   * @param page Playwright 页面对象
   */
  constructor(page: Page) {
    this.page = page;
    this.characterHeader = page.locator(SELECTORS.CHARACTER_DETAIL_HEADER);
    this.basicInfo = page.locator(SELECTORS.CHARACTER_BASIC_INFO);
    this.relationshipGraph = page.locator(SELECTORS.RELATIONSHIP_GRAPH);
    this.loadingSpinner = page.locator(SELECTORS.LOADING_SPINNER);
  }

  /**
   * 导航到指定角色详情页
   * @param characterId 角色 ID
   * @param locale 可选的语言代码（zh、en、ja）
   */
  async navigateToCharacter(
    characterId: string,
    locale?: string
  ): Promise<void> {
    let url: string = ROUTES.CHARACTER_DETAIL(characterId);

    // 如果指定了语言，需要添加语言前缀
    if (locale) {
      url = `/${locale}/characters/${characterId}`;
    }

    await navigateAndWait(this.page, url);
    await this.waitForPageLoad();
  }

  /**
   * 等待页面加载完成
   * 包括：网络请求完成、DOM 加载、动画完成、数据加载
   */
  async waitForPageLoad(): Promise<void> {
    // 等待网络空闲
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForLoadState("domcontentloaded");

    // 等待页面稳定（包括动画完成）
    await waitForPageStable(this.page);
  }

  /**
   * 获取角色名字（从 h1 或 h2 标签）
   * @returns 角色名字
   */
  async getCharacterName(): Promise<string | null> {
    try {
      // 尝试从第一个 h1 或 h2 标签获取名字
      const heading = this.page.locator("h1, h2").first();
      await waitForElementVisible(this.page, "h1, h2", TIMEOUTS.MEDIUM);
      return await heading.textContent();
    } catch {
      return null;
    }
  }

  /**
   * 获取角色代号
   * @returns 角色代号
   */
  async getCharacterCode(): Promise<string | null> {
    try {
      const codeElement = this.page.locator(SELECTORS.CHARACTER_CODE).first();
      if ((await codeElement.count()) > 0) {
        return await codeElement.textContent();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 获取角色描述信息
   * @returns 角色描述
   */
  async getCharacterDescription(): Promise<string | null> {
    try {
      // 查找描述文本（通常在 section 或 p 标签中）
      const description = this.page.locator("section p").first();
      if ((await description.count()) > 0) {
        return await description.textContent();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 获取基本信息区域的所有内容
   * @returns 基本信息对象
   */
  async getBasicInfo(): Promise<Record<string, string>> {
    await waitForElementVisible(
      this.page,
      SELECTORS.CHARACTER_BASIC_INFO,
      TIMEOUTS.MEDIUM
    );

    const basicInfoData: Record<string, string> = {};

    // 获取所有标签和对应的值
    const labels = await this.page
      .locator("[data-testid='character-basic-info'] .text-sm")
      .all();

    for (const label of labels) {
      const labelText = await label.textContent();
      if (labelText) {
        // 获取相邻的值元素
        const value = await label.evaluate((el) => {
          const nextDiv = el.parentElement?.nextElementSibling;
          return nextDiv?.textContent || "";
        });
        basicInfoData[labelText.trim()] = value.trim();
      }
    }

    return basicInfoData;
  }

  /**
   * 检查关系图谱是否存在
   * @returns 关系图谱是否存在
   */
  async hasRelationshipGraph(): Promise<boolean> {
    return await elementExists(this.page, SELECTORS.RELATIONSHIP_GRAPH);
  }

  /**
   * 等待关系图谱加载完成
   */
  async waitForRelationshipGraphLoad(): Promise<void> {
    if (await this.hasRelationshipGraph()) {
      await waitForElementVisible(
        this.page,
        SELECTORS.RELATIONSHIP_GRAPH,
        TIMEOUTS.MEDIUM
      );
      await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
    }
  }

  /**
   * 获取关系图谱中的节点
   * @returns 节点 Locator 对象
   */
  getGraphNodes(): Locator {
    return this.page.locator(SELECTORS.GRAPH_NODE);
  }

  /**
   * 获取图谱中指定角色的节点
   * @param characterId 角色 ID
   * @returns 节点 Locator 对象
   */
  getGraphNodeById(characterId: string): Locator {
    return this.page.locator(
      `${SELECTORS.GRAPH_NODE}[data-node-id="${characterId}"]`
    );
  }

  /**
   * 获取关系图谱中节点的总数
   * @returns 节点数量
   */
  async getGraphNodeCount(): Promise<number> {
    return await this.getGraphNodes().count();
  }

  /**
   * 点击关系图谱中的指定节点
   * @param characterId 角色 ID
   */
  async clickGraphNode(characterId: string): Promise<void> {
    const node = this.getGraphNodeById(characterId);

    if ((await node.count()) === 0) {
      throw new Error(`未找到 ID 为 "${characterId}" 的图谱节点`);
    }

    await scrollToElement(this.page, SELECTORS.RELATIONSHIP_GRAPH);
    await node.first().click();
    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
  }

  /**
   * 点击图谱中的第一个节点
   */
  async clickFirstGraphNode(): Promise<void> {
    const firstNode = this.getGraphNodes().first();

    if ((await firstNode.count()) === 0) {
      throw new Error("关系图谱中没有可用节点");
    }

    await scrollToElement(this.page, SELECTORS.RELATIONSHIP_GRAPH);
    await firstNode.click();
    await waitForAnimation(this.page, TIMEOUTS.ANIMATION);
  }

  /**
   * 获取关系图谱边线
   * @returns 边线 Locator 对象
   */
  getGraphEdges(): Locator {
    return this.page.locator(SELECTORS.GRAPH_EDGE);
  }

  /**
   * 获取关系图谱边线数量
   * @returns 边线数量
   */
  async getGraphEdgeCount(): Promise<number> {
    return await this.getGraphEdges().count();
  }

  /**
   * 检查指定 section 是否存在
   * @param sectionId section 的 id 属性
   * @returns 是否存在
   */
  async hasSectionById(sectionId: string): Promise<boolean> {
    return await elementExists(this.page, `section#${sectionId}`);
  }

  /**
   * 检查指定名称的 section 是否存在
   * @param sectionName section 标题文本
   * @returns 是否存在
   */
  async hasSectionByTitle(sectionName: string): Promise<boolean> {
    return await elementExists(
      this.page,
      `section:has(h2:text-is("${sectionName}"))`
    );
  }

  /**
   * 获取所有 section 的 ID 列表
   * @returns section ID 数组
   */
  async getAllSectionIds(): Promise<string[]> {
    const sections = await this.page.locator("section[id]").all();
    const ids: string[] = [];

    for (const section of sections) {
      const id = await section.getAttribute("id");
      if (id) {
        ids.push(id);
      }
    }

    return ids;
  }

  /**
   * 获取所有 section 的标题列表
   * @returns section 标题数组
   */
  async getAllSectionTitles(): Promise<string[]> {
    const headings = await this.page.locator("section h2, section h3").all();
    const titles: string[] = [];

    for (const heading of headings) {
      const text = await heading.textContent();
      if (text) {
        titles.push(text.trim());
      }
    }

    return titles;
  }

  /**
   * 滚动到指定 section
   * @param sectionId section 的 id 属性
   */
  async scrollToSection(sectionId: string): Promise<void> {
    await scrollToElement(this.page, `section#${sectionId}`);
  }

  /**
   * 检查页面是否成功加载
   * @returns 页面是否加载成功
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      const heading = await this.page.locator("h1, h2").first().count();
      return heading > 0;
    } catch {
      return false;
    }
  }

  /**
   * 验证当前页面 URL 是否为角色详情页
   * @param characterId 角色 ID
   * @returns 是否为指定角色的详情页
   */
  isCharacterDetailUrl(characterId?: string): boolean {
    const url = this.page.url();
    if (characterId) {
      return url.includes(`/characters/${characterId}`);
    }
    return (
      /\/characters\/[\w]+\/?$/.test(url) ||
      /\/[\w]{2}\/characters\/[\w]+\/?$/.test(url)
    );
  }

  /**
   * 获取当前页面 URL
   * @returns 当前 URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * 获取页面标题
   * @returns 页面标题
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * 获取关键词标签列表
   * @returns 关键词数组
   */
  async getKeywords(): Promise<string[]> {
    const keywords = await this.page
      .locator("span:has-text()")
      .filter({ has: this.page.locator("text=/^[^\\s]+$/") })
      .all();

    const keywordList: string[] = [];
    for (const keyword of keywords) {
      const text = await keyword.textContent();
      if (text && text.trim().length < 50) {
        // 关键词通常较短
        keywordList.push(text.trim());
      }
    }

    return keywordList;
  }

  /**
   * 检查页面是否有加载动画
   * @returns 是否有加载动画
   */
  async hasLoadingAnimation(): Promise<boolean> {
    return await elementExists(this.page, SELECTORS.LOADING_SPINNER);
  }

  /**
   * 等待加载动画消失
   */
  async waitForLoadingToComplete(): Promise<void> {
    const hasLoading = await this.hasLoadingAnimation();
    if (hasLoading) {
      await this.loadingSpinner.waitFor({
        state: "hidden",
        timeout: TIMEOUTS.LONG,
      });
    }
  }

  /**
   * 获取指定 section 的内容文本
   * @param sectionId section 的 id 属性
   * @returns section 内容文本
   */
  async getSectionContent(sectionId: string): Promise<string | null> {
    const section = this.page.locator(`section#${sectionId}`);
    if ((await section.count()) === 0) {
      return null;
    }
    return await section.textContent();
  }

  /**
   * 检查 section 是否在视口中可见
   * @param sectionId section 的 id 属性
   * @returns 是否在视口中
   */
  async isSectionInViewport(sectionId: string): Promise<boolean> {
    const section = this.page.locator(`section#${sectionId}`);
    if ((await section.count()) === 0) {
      return false;
    }
    const boundingBox = await section.boundingBox();
    if (!boundingBox) {
      return false;
    }
    // 获取视口尺寸
    const viewport = this.page.viewportSize();
    if (!viewport) {
      return false;
    }
    // 检查元素是否在视口范围内
    return (
      boundingBox.y < viewport.height &&
      boundingBox.y + boundingBox.height > 0 &&
      boundingBox.x < viewport.width &&
      boundingBox.x + boundingBox.width > 0
    );
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await waitForPageStable(this.page);
  }

  /**
   * 刷新页面
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
