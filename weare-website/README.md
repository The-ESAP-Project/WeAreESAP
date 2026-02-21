# We Are ESAP | 向那卫星许愿

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

科幻世界观创作企划网站 — 角色档案、时间线、技术文档、关系图谱。

**https://weare.esaps.net**

## 功能

- 角色档案 — 详细的角色信息与背景故事
- 关系图谱 — 基于 ReactFlow + ELK 的交互式角色关系可视化
- 时间线 — 世界观重大事件的时间轴展示
- 全文搜索 — Fuse.js 客户端模糊搜索
- 多语言 — 中文 / English / 日本語
- 图片模糊占位 — 预生成 base64 blur placeholder，提升加载体验

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Standalone) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| 国际化 | next-intl v4 |
| 图谱 | ReactFlow + ELK (自动布局) |
| 搜索 | Fuse.js |
| 代码质量 | Biome (lint + format), TypeScript |
| 测试 | Vitest (单元) + Playwright (E2E) |

## 开发

需要 [pnpm](https://pnpm.io/) 和 Node.js 18+。在仓库根目录先 `pnpm install`，然后：

```bash
cd weare-website

pnpm dev                    # 启动开发服务器
pnpm run build              # 生产构建 (含 sitemap 生成)
pnpm run lint               # 代码检查
pnpm run lint:fix           # 自动修复
pnpm run format             # 格式化
pnpm run test:unit          # 单元测试 (watch)
pnpm run test:unit:run      # 单元测试 (CI)
pnpm run test:unit:coverage # 单元测试覆盖率
pnpm run test:e2e           # E2E 测试 (Chromium + Firefox + Mobile Chrome)
pnpm run blur:generate      # 重新生成图片模糊占位
pnpm run sitemap:generate   # 重新生成 sitemap
pnpm run analyze            # 包体积分析
```

## 项目结构

```
app/[locale]/
  characters/           角色列表
  characters/[id]/      角色详情
  timeline/             时间线
  technology/           技术文档
  relations/            关系图谱

components/
  character/            角色卡片、手风琴、详情页
  layout/               导航、Footer
  ui/                   通用 UI 组件

data/
  characters/
    shared/             语言无关数据 (基础属性)
    zh-CN/ en/ ja/      各语言角色传记
    relations/          角色关系定义
  timeline/             时间线数据

lib/
  data-loader.ts        通用 JSON 加载 (支持 locale 回退)
  relationship-parser.ts  关系数据解析
  graph-layout.ts       ELK 图谱自动布局

scripts/
  generate-blur-placeholders.mjs  图片模糊占位生成
  generate-build-info.mjs         构建元数据生成
```

## 许可证

代码部分基于 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可。

创作内容基于 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可。

---

**向那卫星许愿** — The ESAP Project
