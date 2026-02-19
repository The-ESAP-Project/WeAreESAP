# 测试指南

本项目包含两种类型的测试：单元测试和端到端（E2E）测试。

## 快速开始

```bash
# 运行所有测试（单元测试 + E2E 测试）
pnpm test

# 只运行单元测试
pnpm test:unit

# 只运行 E2E 测试
pnpm test:e2e
```

## 单元测试 (Vitest)

单元测试用于测试核心工具函数的逻辑。

### 运行单元测试

```bash
# 交互式测试（监听模式，开发时使用）
pnpm test:unit

# 运行一次（CI 模式）
pnpm test:unit:run

# 带 UI 界面的测试
pnpm test:unit:ui

# 生成覆盖率报告
pnpm test:unit:coverage
```

### 单元测试文件位置

- `lib/__tests__/data-loader.test.ts` - 数据加载工具测试
- `lib/__tests__/relationship-parser.test.ts` - 关系解析器测试
- `lib/__tests__/graph-layout.test.ts` - 图布局算法测试

## 端到端测试 (Playwright)

E2E 测试用于测试完整的用户交互流程。

### 运行 E2E 测试

```bash
# 运行所有 E2E 测试
pnpm test:e2e

# 带 UI 界面运行
pnpm test:e2e:ui

# 调试模式
pnpm test:e2e:debug
```

### E2E 测试文件位置

- `e2e/home.spec.ts` - 首页和导航测试
- `e2e/characters.spec.ts` - 角色页面测试
- `e2e/i18n.spec.ts` - 国际化测试

### 系统要求

如果运行 E2E 测试时提示缺少系统依赖，执行：

```bash
# Ubuntu/Debian
sudo apt-get install libgbm1

# 或使用 Playwright 的自动安装
sudo pnpm exec playwright install-deps
```

## 测试覆盖率

当前测试覆盖核心业务逻辑，包括：

- ✅ 数据加载和 locale 回退
- ✅ 关系数据验证和解析
- ✅ 图谱自动布局算法
- ✅ 首页导航和页面跳转
- ✅ 角色列表和详情页
- ✅ 多语言切换功能

## 持续集成

测试脚本已配置好，可以在 CI 环境中运行：

```bash
# 运行所有测试
pnpm test

# 或分别运行
pnpm test:unit:run    # 单元测试（快速）
pnpm test:e2e         # E2E 测试（需要浏览器环境）
```

## 编写新测试

### 单元测试

在 `lib/__tests__/` 目录下创建 `*.test.ts` 文件：

```typescript
import { describe, it, expect } from "vitest";

describe("模块名称", () => {
  it("应该做某件事", () => {
    expect(true).toBe(true);
  });
});
```

### E2E 测试

在 `e2e/` 目录下创建 `*.spec.ts` 文件：

```typescript
import { test, expect } from "@playwright/test";

test("测试描述", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/WeAreESAP/);
});
```
