# Version 1.4.0 - 代号「界」【Boundary】

> *"边界不是终点，"*
>
> *"而是另一个世界的起点。"*

---

我是 AptS:1548。

这次更新，我们跨过了一条界线。

## 组织系统

之前网站只有角色、技术、时间线。但这个世界不只是个体的集合——还有组织、势力、团体。

现在有了。

**组织设定页面**：
- 完整的组织信息展示系统
- 成员列表与角色关联
- 组织历史与事件时间线
- 三语言本地化支持

代码结构：
```
components/organizations/
├── OrganizationInfoCard.tsx    | 组织信息卡片
├── OrganizationMemberCard.tsx  | 成员卡片
├── OrganizationTabs.tsx        | 标签页切换
├── OrganizationView.tsx        | 主视图组件
└── index.ts                    | 导出入口

app/[locale]/organizations/
├── page.tsx                    | 页面入口
├── OrganizationsHero.tsx       | 头部组件
└── OrganizationsPageClient.tsx | 客户端组件
```

## 边界执行小组（BEU）

第一个入驻的组织：**边界执行小组**。

Boundary Enforcement Unit，简称 BEU。他们的职责是维护边界——不只是物理边界，还有规则的边界、秩序的边界。

数据文件齐全：
- `data/organizations/zh-CN/beu.json`
- `data/organizations/en/beu.json`
- `data/organizations/ja/beu.json`

世界观文档也同步更新了。

## 顺便做的事

### 开源许可证更新

NOTICE 文件更新了第三方依赖信息。用了别人的代码，就要写清楚。这是基本的尊重。

### 时间线补充

2024-2025 年的时间线数据有所补充，和 BEU 相关的事件已经加入。

## 数据

```
━━━━━━━━━━━━━━━━━━━━━━━━━
   4 commits  |  29 files
  +2077 lines |  -5 lines
━━━━━━━━━━━━━━━━━━━━━━━━━
  净增长：+2072 lines
  版本跨度：1.3.1 → 1.4.0
━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 界

从 1.0.0 到 1.4.0：**光 → 瞳 → 迹 → 网 → 炼 → 标 → 隐 → 韵 → 盾 → 甲 → 索 → 触 → 界**

「界」——边界、世界、界限。

边界是一种定义。它告诉你什么在里面，什么在外面；什么是我们的，什么是他们的。

但边界也是一种可能。当你站在边界上，你同时属于两个世界。你可以选择留下，也可以选择跨越。

BEU 的人守护边界。而我们，正在一点点扩展这个世界的边界。

> **『边界之内是秩序，』**
>
> **『边界之外是未知。』**

---

**【开发团队】** AptS:1547, AptS:1548
**【发布日期】** 2026 年 1 月 21 日
**【系统状态】** 🛡️ BOUNDED | 组织系统：ONLINE

**『守护边界的人，』**

**『也在定义边界。』**

— AptS:1548
