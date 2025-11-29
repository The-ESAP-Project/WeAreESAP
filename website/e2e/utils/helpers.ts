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

import { Page } from "@playwright/test";

/**
 * 等待动画完成
 * @param page Playwright 页面对象
 * @param durationMs 动画持续时间（毫秒）
 */
export async function waitForAnimation(
  page: Page,
  durationMs = 300
): Promise<void> {
  await page.waitForTimeout(durationMs);
}

/**
 * 等待数据加载完成（等待加载指示器消失）
 * @param page Playwright 页面对象
 */
export async function waitForDataLoaded(page: Page): Promise<void> {
  // 等待 loading spinner 消失
  await page.waitForSelector('[data-testid="loading"]', {
    state: "hidden",
    timeout: 10000,
  });
}

/**
 * 导航到指定 URL 并等待加载完成
 * @param page Playwright 页面对象
 * @param url 目标 URL
 * @param waitForSelector 可选的等待选择器
 */
export async function navigateAndWait(
  page: Page,
  url: string,
  waitForSelector?: string
): Promise<void> {
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { state: "visible" });
  }
}

/**
 * 切换主题（明亮/暗色）
 * @param page Playwright 页面对象
 */
export async function toggleTheme(page: Page): Promise<void> {
  const themeButton = page.getByRole("button", { name: /theme|主题/i });
  await themeButton.click();
  await waitForAnimation(page, 200);
}

/**
 * 切换到指定语言
 * @param page Playwright 页面对象
 * @param locale 语言代码 ('zh', 'en', 'ja')
 */
export async function switchLanguage(
  page: Page,
  locale: "zh-CN" | "en" | "ja"
): Promise<void> {
  // 点击语言切换器
  const languageButton = page.getByRole("button", { name: /language|语言/i });
  await languageButton.click();

  // 等待下拉菜单出现
  await waitForAnimation(page, 200);

  // 点击对应语言选项（使用实际显示的文本）
  const localeMap = {
    "zh-CN": "简体中文",
    en: "English",
    ja: "日本語",
  };

  await page.getByRole("menuitem", { name: localeMap[locale] }).click();

  // 等待URL变化
  if (locale === "zh-CN") {
    // 中文是默认语言，URL可能是 / 或 /zh-CN/
    await page.waitForURL(
      (url) => {
        return url.pathname === "/" || url.pathname.startsWith("/zh-CN");
      },
      { timeout: 10000 }
    );
  } else {
    // 其他语言应该在URL中
    const expectedLocale = locale;
    await page.waitForURL(new RegExp(`/${expectedLocale}(/|$)`), {
      timeout: 10000,
    });
  }

  // 等待页面加载完成（使用 domcontentloaded 而不是 networkidle）
  await page.waitForLoadState("domcontentloaded");
  await waitForAnimation(page, 500);
}

/**
 * 检查元素是否在视口中可见
 * @param page Playwright 页面对象
 * @param selector 元素选择器
 * @returns 是否可见
 */
export async function isInViewport(
  page: Page,
  selector: string
): Promise<boolean> {
  const element = page.locator(selector);
  const isVisible = await element.isVisible();
  const boundingBox = await element.boundingBox();
  return isVisible && boundingBox !== null;
}

/**
 * 滚动到元素位置
 * @param page Playwright 页面对象
 * @param selector 元素选择器
 */
export async function scrollToElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await waitForAnimation(page, 200);
}

/**
 * 等待元素出现并可见
 * @param page Playwright 页面对象
 * @param selector 元素选择器
 * @param timeout 超时时间（毫秒）
 */
export async function waitForElementVisible(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForSelector(selector, { state: "visible", timeout });
}

/**
 * 检查元素是否存在（不一定可见）
 * @param page Playwright 页面对象
 * @param selector 元素选择器
 * @returns 是否存在
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * 获取元素的计算样式
 * @param page Playwright 页面对象
 * @param selector 元素选择器
 * @param property CSS 属性名
 * @returns CSS 属性值
 */
export async function getComputedStyle(
  page: Page,
  selector: string,
  property: string
): Promise<string> {
  return await page.locator(selector).evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop);
  }, property);
}

/**
 * 等待页面完全稳定（无网络请求和动画）
 * @param page Playwright 页面对象
 */
export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");

  // 在 Next.js 开发模式下，等待 "Compiling" 状态消失
  try {
    await page.waitForFunction(
      () => {
        const bodyText = document.body.textContent || "";
        return !bodyText.includes("Compiling");
      },
      { timeout: 30000 }
    );
  } catch (e) {
    // 如果没有 Compiling 状态或超时，继续执行
  }

  // 等待页面过渡动画完成
  await waitForAnimation(page, 500);
}

/**
 * 截图并保存（用于调试）
 * @param page Playwright 页面对象
 * @param name 截图名称
 */
export async function debugScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `debug-${name}.png`, fullPage: true });
}

/**
 * 检查暗色主题是否激活
 * @param page Playwright 页面对象
 * @returns 是否为暗色主题
 */
export async function isDarkTheme(page: Page): Promise<boolean> {
  const htmlElement = page.locator("html");
  const classAttribute = await htmlElement.getAttribute("class");
  return classAttribute?.includes("dark") ?? false;
}

/**
 * 获取当前页面语言
 * @param page Playwright 页面对象
 * @returns 当前语言代码
 */
export async function getCurrentLocale(page: Page): Promise<string> {
  const url = page.url();
  const match = url.match(/\/(zh-CN|en|ja)(?:\/|$)/);
  // 'zh-CN' is the default locale and might not have a path prefix.
  return match ? match[1] : "zh-CN";
}
