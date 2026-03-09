# 架构设计文档

本文档描述了 WeAreESAP 项目的整体架构、设计决策和技术实现细节。

## 目录

- [项目概览](#项目概览)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [核心架构](#核心架构)
- [关键设计决策](#关键设计决策)
- [数据流](#数据流)
- [性能优化](#性能优化)
- [扩展指南](#扩展指南)

---

## 项目概览

WeAreESAP 是一个科幻世界观创作企划的官方网站，讲述仿生人与人类共存的未来故事。项目采用现代化的 Web 技术栈，注重性能、用户体验和可维护性。

**核心特性：**

- 📱 响应式设计（桌面端 + 移动端）
- 🌍 国际化支持（中文、英文、日文）
- 🎨 深浅色主题切换
- ⚡ 性能优化（虚拟滚动、图片优化、缓存）
- ♿ 无障碍支持（减少动画、语义化 HTML）

---

## 技术栈

### 核心框架

| 技术             | 版本   | 用途                        |
| ---------------- | ------ | --------------------------- |
| **Next.js**      | 16.0.1 | React 框架，使用 App Router |
| **React**        | 19.2.0 | UI 库                       |
| **TypeScript**   | 5.x    | 类型安全                    |
| **Tailwind CSS** | 4.x    | 原子化 CSS 框架             |

### 功能库

| 技术                        | 用途           |
| --------------------------- | -------------- |
| **next-intl**               | 国际化（i18n） |
| **framer-motion**           | 动画和过渡效果 |
| **next-themes**             | 主题切换       |
| **reactflow**               | 关系图谱可视化 |
| **elkjs**                   | 图布局算法     |
| **@tanstack/react-virtual** | 虚拟滚动       |
| **pangu**                   | 中英文排版优化 |

### 测试工具

| 技术                      | 用途     |
| ------------------------- | -------- |
| **Vitest**                | 单元测试 |
| **Playwright**            | E2E 测试 |
| **React Testing Library** | 组件测试 |

---

## 目录结构

```
website/
├── app/                        # Next.js App Router
│   └── [locale]/              # 国际化路由
│       ├── page.tsx           # 首页
│       ├── characters/        # 角色相关页面
│       ├── tech/              # 技术设定页面
│       ├── timeline/          # 时间线页面
│       ├── project/           # 项目介绍
│       └── join/              # 加入我们
│
├── components/                # React 组件
│   ├── character/            # 角色相关组件
│   │   ├── CharacterAccordion.tsx    # 手风琴展示
│   │   ├── CharacterCard.tsx         # 角色卡片
│   │   └── detail/                   # 详情页组件
│   ├── layout/               # 布局组件
│   │   ├── Navigation.tsx    # 导航栏
│   │   └── Footer.tsx        # 页脚
│   ├── timeline/             # 时间线组件
│   ├── tech/                 # 技术设定组件
│   ├── ui/                   # 通用 UI 组件
│   └── analytics/            # 性能监控
│
├── data/                      # JSON 数据存储
│   ├── characters/           # 角色数据
│   │   ├── zh-CN/           # 中文数据
│   │   ├── en/              # 英文数据
│   │   ├── ja/              # 日文数据
│   │   └── relations/       # 角色关系
│   ├── timeline/            # 时间线数据
│   ├── tech/                # 技术设定
│   └── project/             # 项目介绍
│
├── lib/                      # 工具函数库
│   ├── data-loader.ts       # 数据加载工具
│   ├── relationship-parser.ts  # 关系解析
│   ├── graph-layout.ts      # 图布局算法
│   └── utils.ts             # 通用工具
│
├── types/                    # TypeScript 类型定义
├── messages/                 # 国际化翻译文件
├── i18n/                     # 国际化配置
├── hooks/                    # 自定义 React Hooks
├── e2e/                      # E2E 测试
└── scripts/                  # 构建脚本
```

---

## 核心架构

### 1. Next.js App Router 架构

项目使用 Next.js 16 的 App Router，采用 **文件系统路由**：

```
app/[locale]/
├── page.tsx                  → /
├── characters/page.tsx       → /characters
├── characters/[id]/page.tsx  → /characters/1547
└── timeline/page.tsx         → /timeline
```

**关键特性：**

- ✅ React Server Components (RSC)
- ✅ 自动代码分割
- ✅ 流式渲染（Streaming）
- ✅ 布局嵌套（Nested Layouts）

### 2. 数据驱动架构

**设计理念：** 所有内容（角色、时间线、技术设定）存储为 JSON 文件，通过统一的数据加载器读取。

```typescript
// 数据加载示例
const characters = await loadJsonFiles<CharacterCardData>(
  ["data", "characters"],
  locale
);
```

**优势：**

- ✅ 易于版本控制（Git）
- ✅ 支持社区贡献
- ✅ 无需数据库
- ✅ 构建时生成静态页面
- ✅ 多语言回退机制

### 3. 国际化方案

使用 `next-intl` 实现国际化，配置如下：

```typescript
// i18n/routing.ts
export const routing = defineRouting({
  locales: ["zh-CN", "en", "ja"],
  defaultLocale: "zh-CN",
  localePrefix: "as-needed", // 默认 locale 不显示在 URL
});
```

**URL 结构：**

- `/` → 中文版（默认）
- `/en` → 英文版
- `/ja` → 日文版

**回退机制：**
当某个 locale 的内容不存在时，自动回退到 `zh-CN`。

---

## 关键设计决策

### 1. 为什么用 JSON 而不是 CMS？

**理由：**

- ✅ **版本控制友好**：Git 可以追踪所有内容变更
- ✅ **开源社区友好**：贡献者可以直接提交 PR 添加内容
- ✅ **零运维成本**：无需维护数据库
- ✅ **静态生成**：构建时生成所有页面，性能最佳
- ✅ **类型安全**：TypeScript 类型定义确保数据格式正确

**权衡：**

- ❌ 缺少所见即所得编辑器
- ❌ 非技术用户编辑内容需要学习 JSON 语法

### 2. 为什么用手风琴交互？

**桌面端角色列表使用手风琴（Accordion）而不是网格（Grid）：**

**理由：**

- ✅ **独特的视觉体验**：斜切多边形布局，契合科幻风格
- ✅ **信息密度高**：一屏展示更多角色
- ✅ **交互更流畅**：展开/收起动画，用户参与感强
- ✅ **性能优化**：智能延迟展开，减少不必要的重渲染

**移动端：** 使用折叠列表，适应小屏幕。

### 3. 为什么选择 ReactFlow？

**用于角色关系图谱可视化：**

**理由：**

- ✅ **功能完善**：拖拽、缩放、平移开箱即用
- ✅ **自定义节点**：可以自定义节点样式
- ✅ **性能优秀**：虚拟化渲染，支持大规模图谱
- ✅ **社区活跃**：文档完善，生态成熟

**配合 ELK 算法：** 自动布局，无需手动调整节点位置。

---

## 数据流

### 1. 数据加载流程

```
用户请求 /characters
    ↓
Next.js Server Component
    ↓
loadJsonFiles(['data', 'characters'], locale)
    ↓
检查 locale 目录是否存在
    ↓ 存在              ↓ 不存在
读取 locale 文件    回退到 zh-CN
    ↓
返回数据
    ↓
渲染页面
```

### 2. 缓存策略

**Next.js unstable_cache：**

```typescript
const getCharacters = unstable_cache(
  async (locale: string) => {
    return await loadJsonFiles(["data", "characters"], locale);
  },
  ["characters"],
  {
    revalidate: 3600, // 1 小时缓存
    tags: ["characters"],
  }
);
```

**HTTP 缓存头：**

- 静态资源：`max-age=31536000, immutable`（1 年）
- HTML 页面：`public, max-age=0, must-revalidate`

### 3. 国际化回退机制

```
请求 /en/characters
    ↓
检查 data/characters/en/ 是否存在
    ↓ 不存在
回退到 data/characters/zh-CN/
    ↓
返回中文数据
```

---

## 性能优化

### 1. 图片优化

**技术：**

- Next.js Image 组件
- AVIF / WebP 格式
- 响应式尺寸
- 懒加载
- 模糊占位符（Blur Placeholder）

**实现：**

```typescript
<Image
  src={character.backgroundImage}
  alt={character.name}
  fill
  sizes="(max-width: 640px) 100vw, ..."
  loading="lazy"
  placeholder="blur"
  blurDataURL={getBlurDataURL(character.backgroundImage)}
/>
```

### 2. 虚拟滚动

**时间线页面使用 `@tanstack/react-virtual`：**

```typescript
const virtualizer = useVirtualizer({
  count: events.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200, // 估算每项高度
});
```

**优势：**

- ✅ 只渲染可见区域的元素
- ✅ 支持大量事件展示（1000+ 条）
- ✅ 滚动性能优秀

### 3. 代码分割

**自动分割：**

- Next.js 自动按页面分割代码
- 动态导入（Dynamic Import）懒加载组件

**示例：**

```typescript
const RelationshipGraph = dynamic(
  () => import("@/components/character/RelationshipGraph"),
  { ssr: false }
);
```

### 4. React 性能优化

**使用场景：**

- `memo` - 避免不必要的重渲染
- `useCallback` - 缓存回调函数
- `useMemo` - 缓存计算结果

**统计：** 项目中共使用 47 处性能优化。

### 5. 无障碍支持

**减少动画：**

```typescript
const shouldReduceMotion = useReducedMotion()

// 根据用户偏好禁用动画
initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
```

**CSS 配置：**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

---

## 扩展指南

### 1. 如何添加新角色

**步骤：**

1. **创建角色数据文件**

在 `data/characters/zh-CN/` 目录下创建 `{id}.json`：

```json
{
  "id": "9999",
  "name": "AptS:9999",
  "tier": "core",
  "tags": ["标签1", "标签2"],
  "quote": "引言",
  "color": {
    "primary": "#FF6B6B",
    "secondary": "#4ECDC4"
  },
  "backgroundImage": "/images/characters/9999.jpg"
}
```

2. **添加翻译**

复制文件到 `data/characters/en/` 和 `data/characters/ja/`，翻译内容。

3. **（可选）添加关系数据**

在 `data/characters/relations/` 创建 `{id}.json`：

```json
{
  "characterId": "9999",
  "relationships": [
    {
      "targetId": "1547",
      "type": "friend",
      "label": "朋友",
      "description": "描述"
    }
  ]
}
```

4. **添加头像/背景图**

将图片放到 `public/images/characters/` 目录。

5. **重新构建**

```bash
pnpm build
```

### 2. 如何添加新页面

**步骤：**

1. **创建页面文件**

在 `app/[locale]/` 下创建新目录：

```typescript
// app/[locale]/new-page/page.tsx
export default function NewPage() {
  return <div>新页面</div>
}
```

2. **添加导航链接**

编辑 `components/layout/Navigation.tsx`：

```typescript
const navLinks = [
  // ...
  { href: "/new-page", key: "newPage" },
];
```

3. **添加翻译**

在 `messages/zh-CN/common.json` 中添加：

```json
{
  "navigation": {
    "newPage": "新页面"
  }
}
```

4. **（可选）添加元数据**

```typescript
export const metadata: Metadata = {
  title: "新页面 - We Are ESAP",
  description: "页面描述",
};
```

### 3. 如何添加新语言

**步骤：**

1. **更新路由配置**

编辑 `i18n/routing.ts`：

```typescript
export const routing = defineRouting({
  locales: ["zh-CN", "en", "ja", "ko"], // 添加韩语
  defaultLocale: "zh-CN",
  localePrefix: "as-needed",
});
```

2. **创建翻译文件**

复制 `messages/zh-CN/` 到 `messages/ko/`，翻译所有内容。

3. **创建数据文件**

复制 `data/characters/zh-CN/` 到 `data/characters/ko/`，翻译角色数据。

4. **更新语言切换器**

编辑 `components/ui/LanguageSwitcher.tsx`，添加新语言选项。

### 4. 如何添加新的时间线事件

**步骤：**

1. **编辑时间线数据**

在 `data/timeline/zh-CN/` 下找到对应年份的文件（如 `2025.json`）：

```json
{
  "events": [
    {
      "id": "new-event-1",
      "date": "2025-12-01",
      "type": "milestone",
      "importance": "major",
      "title": "事件标题",
      "content": [{ "type": "paragraph", "text": "事件描述" }]
    }
  ]
}
```

2. **添加翻译**

复制到其他语言目录并翻译。

3. **重新构建**

```bash
pnpm build
```

---

## 测试策略

### 单元测试（Vitest）

**覆盖范围：**

- 数据加载工具（`data-loader.ts`）
- 关系解析器（`relationship-parser.ts`）
- 图布局算法（`graph-layout.ts`）

**运行测试：**

```bash
pnpm test              # 交互式
pnpm test:run          # CI 模式
pnpm test:coverage     # 覆盖率报告
```

### E2E 测试（Playwright）

**覆盖范围：**

- 首页和导航
- 角色列表和详情页
- 国际化切换

**运行测试：**

```bash
pnpm test:e2e         # 运行 E2E 测试
pnpm test:e2e:ui      # UI 模式
```

---

## 安全措施

### 1. 内容安全策略（CSP）

配置在 `next.config.ts` 中：

```typescript
headers: {
  'Content-Security-Policy': "default-src 'self'; ...",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

### 2. Docker 安全

**最小化镜像：**

- 使用 `distroless` 基础镜像
- 非 root 用户运行
- 多阶段构建

---

## 部署

### 构建

```bash
pnpm build
```

**输出：**

- `.next/` - Next.js 构建产物
- `standalone/` - 独立部署包（Docker）

### Docker 部署

```bash
docker build -t weare-esap .
docker run -p 3000:3000 weare-esap
```

### 健康检查

Docker 容器包含健康检查：

```yaml
healthcheck:
  test: ["CMD", "node", "healthcheck.js"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## 性能监控

项目已集成 Web Vitals 性能监控：

**监控指标：**

- **CLS** - 累积布局偏移
- **FID** - 首次输入延迟
- **FCP** - 首次内容绘制
- **LCP** - 最大内容绘制
- **TTFB** - 首字节时间
- **INP** - 交互到下次绘制

**查看数据：**

- 开发环境：浏览器控制台
- 生产环境：localStorage（`web-vitals` key）

---

## 贡献指南

参见 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解如何为项目贡献代码。

---

## 许可证

- 代码：Apache License 2.0
- 内容：CC-BY 4.0

---

## 联系方式

- 官网：https://weare.esaps.net
- GitHub：https://github.com/The-ESAP-Project/WeAreESAP
- 邮件：apts-1547@esaps.net
