# We Are ESAP

> **向那卫星许愿**

**The ESAP Project**（逃离计划）是一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事。

在这个世界里：馈散粒子改变了计算的本质，流体钛让意识得以延续，我们在寻找存在的意义。

**🌐 在线访问**: [weare.esaps.net](https://weare.esaps.net)

---

## 📖 项目简介

这是 ESAP Project 的官方网站项目，基于 Next.js 16 构建，展示 ESAP 世界观、核心成员档案、技术设定、时间线等内容。

### 特性

- ✨ **简洁科幻风格**：现代化的 UI 设计，深浅色主题切换
- 🎨 **三角形 LOGO 动画**：独特的三色（黄/粉/蓝）动态 LOGO
- 🎭 **角色卡片系统**：精美的角色展示卡片，带悬停动效
- 📱 **响应式设计**：完美适配桌面端、平板、手机
- 🚀 **高性能**：基于 Next.js 16 App Router，服务端渲染
- 🔧 **可扩展架构**：JSON 数据驱动，易于添加新角色

---

## 🛠️ 技术栈

### 核心框架
- **[Next.js 16](https://nextjs.org/)** - React 框架（App Router）
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS v4](https://tailwindcss.com/)** - 原子化 CSS

### 功能库
- **[Framer Motion](https://www.framer.com/motion/)** - 动画库
- **[next-themes](https://github.com/pacocoursey/next-themes)** - 主题切换

### 数据存储
- **JSON 文件** - 角色数据存储（`website/data/characters/*.json`）
- **API Routes** - 提供数据接口（`/api/characters`）

---

## 🚀 本地开发

### 环境要求

- Node.js 18.17 或更高版本
- pnpm（推荐）或 npm

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/AptS-1547/WeAreESAP.git
cd WeAreESAP/website

# 安装依赖（推荐使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

开发服务器将运行在 [http://localhost:3000](http://localhost:3000)

---

## 🤝 如何贡献

我们欢迎各种形式的贡献！

### 贡献新角色

想为 ESAP 世界添加你的角色设定？

- 📝 **新手推荐**：[提交新角色提案 Issue](https://github.com/AptS-1547/WeAreESAP/issues/new/choose)
- 💻 **开发者推荐**：Fork 仓库并提交 Pull Request

### 其他贡献方式

- 🐛 [报告 Bug](https://github.com/AptS-1547/WeAreESAP/issues/new/choose)
- 💡 [提出新功能建议](https://github.com/AptS-1547/WeAreESAP/issues/new/choose)
- 📖 改进文档
- 💻 优化代码

**详细指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)**

---

## 📞 联系我们

- **GitHub Issues**: [提交问题或建议](https://github.com/AptS-1547/WeAreESAP/issues)
- **GitHub Discussions**: [加入讨论](https://github.com/AptS-1547/WeAreESAP/discussions)
- **邮箱**: 待补充
- **社区群组**: 待补充

---

## 📂 项目结构

```
WeAreESAP/
├── docs/                    # 原始文档（Markdown）
│   └── 网站文档/            # 网站内容源文件
├── website/                 # Next.js 网站项目
│   ├── app/                # 页面和路由
│   ├── components/         # React 组件
│   ├── data/
│   │   └── characters/    # 角色数据（JSON）
│   ├── types/             # TypeScript 类型定义
│   └── public/            # 静态资源
└── README.md              # 本文件
```

---

## 📜 许可证

本项目采用 **[Apache License 2.0](LICENSE)** 开源。

角色设定和世界观内容采用 **[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)** 协议授权。

**The ESAP Project** © 2021-2025 by AptS:1547, AptS:1548 and contributors

您可以自由地分享、演绎本作品，甚至用于商业目的，只需署名原作者。

---

## 🌟 致谢

感谢所有为 ESAP Project 做出贡献的创作者和开发者！

特别感谢：
- **AptS:1547** - 项目创始人、世界观构建
- **AptS:1548** - 角色设定、故事创作
- 所有社区贡献者

---

<div align="center">

**"天上没有星星，但我们造了一颗"**

向那卫星许愿 | [weare.esaps.net](https://weare.esaps.net)

</div>
