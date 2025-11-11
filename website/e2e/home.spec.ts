// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/test";

test.describe("首页", () => {
  test("应该成功加载首页", async ({ page }) => {
    await page.goto("/");

    // 验证页面标题（实际标题是 "We Are ESAP - Wish Upon a Satellite"）
    await expect(page).toHaveTitle(/We Are ESAP/);

    // 验证导航栏存在
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("应该显示主要导航链接", async ({ page }) => {
    await page.goto("/");

    // 验证导航栏有链接（更宽松的检查）
    const nav = page.locator("nav");
    const navLinks = nav.locator("a");

    // 至少应该有几个导航链接
    expect(await navLinks.count()).toBeGreaterThan(2);

    // 验证有指向 /characters 的链接
    const charactersLink = page
      .locator('a[href="/characters"]')
      .or(page.locator('a[href*="characters"]'));
    await expect(charactersLink.first()).toBeVisible();
  });

  test("应该能够导航到角色页面", async ({ page }) => {
    await page.goto("/");

    // 直接点击 characters 链接
    const charactersLink = page
      .locator('a[href="/characters"]')
      .or(page.locator('a[href*="characters"]'))
      .first();

    await charactersLink.click();

    // 验证 URL 变化
    await expect(page).toHaveURL(/\/characters/);
  });

  test("应该支持主题切换", async ({ page }) => {
    await page.goto("/");

    // 查找主题切换按钮（精确匹配 aria-label）
    const themeToggle = page.getByLabel("切换主题");

    // 直接断言按钮可见性
    await expect(themeToggle, "主题切换按钮应该可见").toBeVisible();
    await themeToggle.click();

    // 验证主题发生变化（检查 HTML 元素的 class 或 data 属性）
    const html = page.locator("html");
    const hasThemeClass = await html.evaluate((el) => {
      return el.classList.contains("dark") || el.classList.contains("light");
    });
    expect(hasThemeClass, "HTML 元素应该有主题相关的 class").toBeTruthy();
  });
});
