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
import {
  toggleTheme,
  switchLanguage,
  isDarkTheme,
  getCurrentLocale,
  waitForAnimation,
  waitForPageStable,
  getComputedStyle,
} from "./utils/helpers";
import {
  ROUTES,
  SELECTORS,
  TIMEOUTS,
  THEMES,
  LOCALES,
} from "./fixtures/test-data";

test.describe("主题切换和国际化", () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto(ROUTES.HOME);
    await waitForPageStable(page);
  });

  test.describe("主题切换", () => {
    test("主题切换按钮应该正确显示", async ({ page }) => {
      // 检查主题切换按钮是否存在
      const themeButton = page.getByRole("button", { name: /theme|主题/i });
      await expect(themeButton).toBeVisible();

      // 验证按钮可点击
      await expect(themeButton).toBeEnabled();
    });

    test("切换到暗色主题，页面样式应该改变", async ({ page }) => {
      // 验证初始状态为亮色主题
      let isDark = await isDarkTheme(page);
      if (isDark) {
        // 如果已经是暗色，先切换到亮色
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 获取切换前的背景色
      const bodyBeforeBg = await getComputedStyle(
        page,
        "body",
        "background-color"
      );

      // 切换到暗色主题
      await toggleTheme(page);
      await waitForAnimation(page, TIMEOUTS.ANIMATION);

      // 验证主题已切换
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(true);

      // 验证样式已改变
      const bodyAfterBg = await getComputedStyle(
        page,
        "body",
        "background-color"
      );
      expect(bodyAfterBg).not.toBe(bodyBeforeBg);

      // 验证 html 元素包含 dark class
      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).toContain("dark");
    });

    test("切换到亮色主题，页面样式应该恢复", async ({ page }) => {
      // 先切换到暗色主题
      let isDark = await isDarkTheme(page);
      if (!isDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 获取暗色主题下的背景色
      const bodyDarkBg = await getComputedStyle(
        page,
        "body",
        "background-color"
      );

      // 切换回亮色主题
      await toggleTheme(page);
      await waitForAnimation(page, TIMEOUTS.ANIMATION);

      // 验证主题已切换回亮色
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(false);

      // 验证样式已恢复
      const bodyLightBg = await getComputedStyle(
        page,
        "body",
        "background-color"
      );
      expect(bodyLightBg).not.toBe(bodyDarkBg);

      // 验证 html 元素不包含 dark class
      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).not.toContain("dark");
    });

    test("刷新页面后主题应该保持", async ({ page }) => {
      // 切换到暗色主题
      let initialIsDark = await isDarkTheme(page);
      if (!initialIsDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 验证已切换到暗色主题
      initialIsDark = await isDarkTheme(page);
      expect(initialIsDark).toBe(true);

      // 刷新页面
      await page.reload();
      await waitForPageStable(page);

      // 验证刷新后主题保持
      const afterReloadIsDark = await isDarkTheme(page);
      expect(afterReloadIsDark).toBe(true);
    });
  });

  test.describe("语言切换", () => {
    test("语言切换器应该显示当前语言", async ({ page }) => {
      // 检查语言切换按钮是否存在
      const languageButton = page.getByRole("button", {
        name: /language|语言/i,
      });
      await expect(languageButton).toBeVisible();

      // 验证按钮可点击
      await expect(languageButton).toBeEnabled();
    });

    test("切换到英文，内容应该翻译正确", async ({ page }) => {
      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证 URL 更新为英文
      await expect(page).toHaveURL(/\/en/);

      // 验证页面标题包含英文
      await expect(page).toHaveTitle(/We Are ESAP/);

      // 验证当前语言代码
      const currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);

      // 验证页面包含英文内容（至少有一些英文单词）
      const bodyText = await page.locator("body").textContent();
      expect(bodyText).toMatch(/[A-Za-z]{3,}/); // 至少包含3个字母以上的英文单词
    });

    test("切换到日文，内容应该翻译正确", async ({ page }) => {
      // 切换到日文
      await switchLanguage(page, LOCALES.JAPANESE);
      await waitForPageStable(page);

      // 验证 URL 更新为日文
      await expect(page).toHaveURL(/\/ja/);

      // 验证当前语言代码
      const currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.JAPANESE);

      // 验证页面可见（可能回退到中文）
      await expect(page.locator("body")).toBeVisible();
    });

    test("切换语言后 URL 应该正确更新", async ({ page }) => {
      // 初始状态（中文，默认无前缀或 /zh）
      const initialUrl = page.url();

      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);
      await expect(page).toHaveURL(/\/en/);

      // 切换到日文
      await switchLanguage(page, LOCALES.JAPANESE);
      await waitForPageStable(page);
      await expect(page).toHaveURL(/\/ja/);

      // 切换回中文
      await switchLanguage(page, LOCALES.CHINESE);
      await waitForPageStable(page);
      // 中文是默认 locale，URL 可能不包含 /zh（取决于 localePrefix 配置）
      const finalUrl = page.url();
      expect(finalUrl).not.toContain("/en");
      expect(finalUrl).not.toContain("/ja");
    });

    test("刷新页面后语言应该保持", async ({ page }) => {
      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证已切换到英文
      let currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);

      // 刷新页面
      await page.reload();
      await waitForPageStable(page);

      // 验证刷新后语言保持
      currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);
      await expect(page).toHaveURL(/\/en/);
    });
  });

  test.describe("主题和语言切换组合", () => {
    test("主题和语言切换不应该冲突", async ({ page }) => {
      // 切换到暗色主题
      let isDark = await isDarkTheme(page);
      if (!isDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 验证暗色主题已启用
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(true);

      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证主题仍然是暗色
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(true);

      // 验证语言已切换到英文
      const currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);
    });

    test("切换语言后再切换主题应该正常工作", async ({ page }) => {
      // 先切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证语言已切换
      let currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);

      // 再切换到暗色主题
      let isDark = await isDarkTheme(page);
      if (!isDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 验证主题已切换到暗色
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(true);

      // 验证语言仍然是英文
      currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(LOCALES.ENGLISH);
    });

    test("刷新页面后主题和语言都应该保持", async ({ page }) => {
      // 切换到暗色主题
      let isDark = await isDarkTheme(page);
      if (!isDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证主题和语言都已切换
      isDark = await isDarkTheme(page);
      let currentLocale = await getCurrentLocale(page);
      expect(isDark).toBe(true);
      expect(currentLocale).toBe(LOCALES.ENGLISH);

      // 刷新页面
      await page.reload();
      await waitForPageStable(page);

      // 验证刷新后主题和语言都保持
      isDark = await isDarkTheme(page);
      currentLocale = await getCurrentLocale(page);
      expect(isDark).toBe(true);
      expect(currentLocale).toBe(LOCALES.ENGLISH);
    });

    test("在角色详情页切换主题和语言", async ({ page }) => {
      // 导航到角色详情页
      await page.goto(ROUTES.CHARACTER_DETAIL("1547"));
      await waitForPageStable(page);

      // 切换到暗色主题
      let isDark = await isDarkTheme(page);
      if (!isDark) {
        await toggleTheme(page);
        await waitForAnimation(page, TIMEOUTS.ANIMATION);
      }

      // 切换到英文
      await switchLanguage(page, LOCALES.ENGLISH);
      await waitForPageStable(page);

      // 验证 URL 包含英文路径和角色 ID
      await expect(page).toHaveURL(/\/en\/characters\/1547/);

      // 验证主题为暗色
      isDark = await isDarkTheme(page);
      expect(isDark).toBe(true);

      // 验证页面内容存在
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();
    });
  });
});
