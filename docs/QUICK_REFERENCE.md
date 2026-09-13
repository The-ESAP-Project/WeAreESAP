# WeAreESAP 架构快速参考

## 1️⃣ 目录分布概览

```
weare-website/ (16个主目录)
│
├─ 🎨 app/              (15个页面文件) - 用户可见的页面
├─ 🧩 components/       (48个组件) - 可复用的UI组件  ⚠️ 有3个超过200行
├─ 📦 data/             (62个JSON) - 多语言内容数据
├─ 🛠️  lib/              (6个文件) - 工具函数库
├─ 📝 types/            (7个文件) - TypeScript类型定义
├─ 🎯 hooks/            (3个文件) - 自定义React Hooks
├─ 🌍 i18n/             (3个文件) - 国际化配置
├─ 💬 messages/         (24个JSON) - 多语言翻译
├─ 📜 public/           (静态资源)
├─ 🔧 scripts/          (构建脚本)
└─ ⚠️  _unused_code/     (待删除)  ⚠️ 需要清理
```

## 2️⃣ 主要成分大小

```
组件库代码        ~3,966行  ████████████████░░░░
工具函数          ~576行   ███░░░░░░░░░░░░░░░░░░░
数据文件          ~480KB   (62个JSON文件)
页面代码          ~240行   ██░░░░░░░░░░░░░░░░░░░░░
类型定义          ~多个   
```

## 3️⃣ 最大的5个文件（需要关注）

| 文件 | 行数 | 问题级别 | 建议 |
|------|------|--------|------|
| CharacterAccordion.tsx | 336 | 🔴 高 | 拆分为3个文件 |
| TimelineContent.tsx | 232 | 🟡 中 | 提取子组件 |
| TechContent.tsx | 211 | 🟡 中 | 简化条件渲染 |
| CharacterMobileView.tsx | 213 | 🟡 中 | 独立逻辑Hook |
| Icon.tsx | 197 | 🟡 中 | 拆分SVG到icons/目录 |

## 4️⃣ 架构优势 ✅

```
✅ 模块化清晰      每个功能独立目录
✅ 类型安全       TypeScript strict 模式
✅ 国际化完善     3语言 + 3套数据
✅ 性能优化       图片、缓存、CDN配置
✅ 安全配置       CSP、XSS、点击劫持防护
✅ 工具完整       ESLint、Prettier、Sitemap
```

## 5️⃣ 关键问题 ⚠️

```
🔴 P0 立即处理
  └─ _unused_code/ 目录需要删除或归档

🟡 P1 短期改进
  ├─ CharacterAccordion.tsx (336行) 需拆分
  ├─ Icon.tsx (197行) 需整理
  └─ 统一数据加载方式

🟢 P2 中期优化
  ├─ Types 按模块组织
  ├─ Hooks 按功能分类
  └─ lib/utils 按职责分文件
```

## 6️⃣ 数据架构

```
data/
├─ characters/     212KB  ┌─ zh-CN (9个角色)
                          ├─ en
                          ├─ ja
                          └─ relations/ (关系数据)
├─ tech/          136KB  ┌─ 15个技术设定
├─ timeline/      108KB  ┌─ 时间线事件
└─ project/        24KB  └─ 项目信息

✅ 优点: 完全分离、易编辑、版本控制友好
⚠️  问题: 没有统一的数据加载层
```

## 7️⃣ 类型系统覆盖

```
types/
├─ character.ts    (角色 + CharacterCardData)
├─ tech.ts         (技术设定)
├─ timeline.ts     (时间线)
├─ project.ts      (项目)
├─ join.ts         (加入相关)
├─ relationship.ts (关系)
└─ relationship-node.ts

✅ 设计完善，使用 meta 对象预留扩展空间
⚠️  建议: 按模块重组为 types/character/、types/tech/ 等
```

## 8️⃣ 组件分布

```
components/
├─ character/           11个 (包括5个detail子组件)
│  ├─ CharacterAccordion.tsx  ⚠️  336行
│  ├─ CharacterCard.tsx       190行
│  ├─ CharacterMobileView.tsx ⚠️  213行
│  └─ detail/
│     ├─ CharacterHero.tsx (194行)
│     ├─ CharacterInfo.tsx (117行)
│     └─ RelationshipGraph.tsx (217行)
│
├─ timeline/            3个 
│  └─ TimelineContent.tsx ⚠️  232行
├─ tech/                3个
│  └─ TechContent.tsx ⚠️  211行
├─ project/            3个
├─ join/               4个
├─ layout/             4个 (导航、页脚、滚动)
├─ ui/                 9个 (基础UI + 动画 + 过渡)
└─ loading/            4个 (加载状态)

✅ 结构清晰，职责明确
⚠️  5个文件超过200行，需要重构
```

## 9️⃣ 工具函数清单

```
lib/utils.ts (205行)
├─ formatDate()           日期格式化
├─ cn()                   className合并
├─ sleep()                延迟函数
├─ truncate()             文本截断
├─ debounce()             防抖
├─ throttle()             节流
├─ getImageUrl()          图片URL处理
├─ getColorLuminance()    颜色亮度 (WCAG)
├─ getContrastTextColor() 对比色 (浅色)
└─ getContrastTextColorDark() 对比色 (深色)

其他文件:
├─ constants.ts           常量
├─ graph-layout.ts        关系图布局
├─ relationship-parser.ts 关系数据解析
└─ blur-placeholder.ts    图片占位符

✅ 工具设计完善，特别是颜色处理
⚠️  建议: 按功能分文件 (string/color/timing/css)
```

## 🔟 国际化配置

```
支持语言: 简体中文、日语、英语
配置方式: next-intl + [locale] 动态路由

messages/          (UI文案)
├─ zh-CN/
│  ├─ common.json       通用文案
│  ├─ home.json
│  ├─ characters.json
│  ├─ project.json
│  ├─ tech.json
│  ├─ timeline.json
│  ├─ join.json
│  └─ notFound.json
├─ en/
└─ ja/

data/characters    (内容数据 - 多语言)
├─ zh-CN/
├─ en/
└─ ja/

✅ 完整的多语言支持，数据和UI分离
⚠️  翻译文案数量 24个JSON文件
```

## 1️⃣1️⃣ 代码质量评分 (满分5星)

```
维度                评分        解释
─────────────────────────────────────
模块化              ⭐⭐⭐⭐⭐    清晰、职责明确
类型安全            ⭐⭐⭐⭐⭐    strict 模式
代码复用            ⭐⭐⭐⭐      部分大文件待拆
可维护性            ⭐⭐⭐⭐      需清理弃用代码
性能优化            ⭐⭐⭐⭐      缺少运行时监控
文档完整性          ⭐⭐⭐        代码注释充分
测试覆盖            ⭐⭐          无测试框架
─────────────────────────────────────
总体评分            ⭐⭐⭐⭐      优秀的生产级
```

## 1️⃣2️⃣ 改进优先级路线图

```
NOW (立即)         SOON (1-2周)       LATER (1个月)      FUTURE (维护中)
├─ 删除_unused    ├─ 拆分大组件      ├─ Types重组        ├─ 状态管理
├─ 规范导入路径   ├─ 整理Icon.tsx    ├─ Hooks分类        ├─ 错误监测
│                 ├─ 创建数据层      ├─ lib优化          └─ 性能监控
│                 └─ 修复文件        └─ SEO元数据
└─ 打分: P0      └─ 打分: P1       └─ 打分: P2       └─ 打分: P3
```

---

**总结**: 这是一个**优秀的生产级项目**，代码结构清晰、类型安全、配置专业。建议按优先级循序渐进地实施改进。

