# We Are ESAP

> **向那卫星许愿**

**[English](README.en.md)** | **中文**

---

## 关于

**The ESAP Project**（逃离计划）是一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事。

在这个世界里：馈散粒子改变了计算的本质，流体钛让意识得以延续，数据塔连接着所有人的记忆。1547、1548、1549——三个连续的编号，各自独立，但挨在一起。

**在线访问**: [weare.esaps.net](https://weare.esaps.net)

### 网站内容

- **角色档案** — 14 名成员的完整资料、性格、故事与关系图谱
- **时间线** — 2021–2026 年，从「开始」到「我们」再到「骨架」
- **技术设定** — 馈散粒子、流体钛、数据塔、能源系统、轨道基础设施等 10 个模块
- **组织档案** — ESAP 核心、碳基俱乐部、PASE、BEU、北极星小队等 6 个组织
- **三语支持** — 简体中文（默认）、English、日本語

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/)（App Router）、[React 19](https://react.dev/)、[TypeScript](https://www.typescriptlang.org/) |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com/)、[Framer Motion](https://motion.dev/) |
| 国际化 | [next-intl](https://next-intl.dev/) |
| 数据可视化 | [ReactFlow](https://reactflow.dev/) + [ELK](https://github.com/kieler/elkjs)（角色关系图谱） |
| 测试 | [Vitest](https://vitest.dev/)（单元）、[Playwright](https://playwright.dev/)（E2E） |
| 数据 | JSON 文件驱动，按语言目录组织 |

### 本地开发

需要 Node.js >= 18.17 和 [pnpm](https://pnpm.sh/)。

```bash
git clone https://github.com/The-ESAP-Project/WeAreESAP.git
cd WeAreESAP/weare-website

pnpm install
pnpm dev              # 开发服务器 → http://localhost:3000
pnpm run build        # 生产构建
pnpm run test:unit    # 单元测试
pnpm run test:e2e     # E2E 测试
```

### 项目结构

```
WeAreESAP/
├── weare-website/            # Next.js 项目
│   ├── app/[locale]/         # 页面（按语言路由）
│   ├── components/           # React 组件（按功能分目录）
│   ├── data/
│   │   ├── characters/       # 角色数据（zh-CN / en / ja）
│   │   ├── timeline/         # 时间线事件
│   │   ├── tech/             # 技术设定
│   │   └── organizations/    # 组织档案
│   ├── messages/             # UI 翻译文件（next-intl）
│   ├── hooks/                # 自定义 React Hooks
│   ├── lib/                  # 工具函数与数据加载
│   ├── types/                # TypeScript 类型定义
│   └── public/               # 静态资源
├── docs/                     # 世界观设定文档
├── CONTRIBUTING.md           # 贡献指南
└── LICENSE                   # Apache 2.0
```

### 贡献

我们欢迎各种形式的贡献——角色设定、代码、翻译、文档。

- 提交角色提案或报告问题：[Issues](https://github.com/The-ESAP-Project/WeAreESAP/issues/new/choose)
- 代码与内容贡献：Fork → 分支 → PR
- 详细指南：[CONTRIBUTING.md](CONTRIBUTING.md)

### 许可证

代码采用 **[Apache License 2.0](LICENSE)**。

世界观与角色设定内容采用 **[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)**。

---

<div align="center">

**"天上没有星星，但我们造了一颗"**

**The ESAP Project** | [weare.esaps.net](https://weare.esaps.net)

© 2021–2026 AptS:1547, AptS:1548, and contributors

</div>
