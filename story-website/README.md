# ESAP Stories | 逃离计划故事站

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

支持交互式叙事的科幻故事阅读平台。

**https://story.esaps.net**

## 功能

- 交互式分支叙事 — 读者选择影响故事走向
- 章节解锁系统 — 阅读进度触发隐藏内容
- 探索场景 — 可交互的场景探索模式
- 多视角叙事 — 同一事件的不同角色视角
- 多语言 — 中文 / English / 日本語
- RSS 订阅 — `/rss.xml`、`/en/rss.xml`、`/ja/rss.xml`
- 阅读状态持久化 — 进度、选择、解锁内容本地存储

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Standalone) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| 国际化 | next-intl v4 |
| 搜索 | Fuse.js |
| 代码质量 | Biome (lint + format), TypeScript |
| 测试 | Vitest |
| 字体 | LXGW WenKai, Yaku Han JP, Geist |

## 开发

需要 [pnpm](https://pnpm.io/) 和 Node.js 18+。在仓库根目录先 `pnpm install`，然后：

```bash
cd story-website

pnpm dev              # 启动开发服务器
pnpm run build        # 生产构建
pnpm run lint         # 代码检查
pnpm run lint:fix     # 自动修复
pnpm run format       # 格式化
pnpm run test:unit    # 单元测试 (watch)
pnpm run test:unit:run # 单元测试 (CI)
```

## 项目结构

```
app/[locale]/
  stories/              故事列表
  stories/[slug]/       故事详情
  stories/[slug]/[chapterId]/   章节阅读
  stories/[slug]/explore/[sceneId]/  场景探索
  characters/           角色页

components/
  layout/               导航、Footer、滚动按钮
  reader/               阅读器及内容块渲染
  search/               搜索组件
  ui/                   通用 UI 组件

data/stories/
  shared/               语言无关数据 (注册表、结构元数据)
  zh-CN/ en/ ja/        各语言故事内容

lib/                    数据加载、分支解析、解锁引擎、阅读状态
types/                  TypeScript 类型定义
```

## 许可证

代码部分基于 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可。

故事内容基于 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可。

---

**向那卫星许愿** — The ESAP Project
