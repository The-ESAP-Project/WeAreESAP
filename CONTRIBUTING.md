# 贡献指南

感谢你对 ESAP Project 的关注！我们欢迎各种形式的贡献——角色设定、代码、翻译、文档。

---

## 行为准则

- 尊重所有参与者
- 接受建设性的批评
- 保持友善和包容的态度
- 尊重核心成员（1547、1548、1549）的设定，不擅自修改他人的角色设定

---

## 贡献角色

### 数据结构

角色数据采用 **shared + locale** 拆分模式：

```
data/characters/
├── shared/        # 不需要翻译的字段（id、颜色、层级等）
│   └── 0152.json
├── zh-CN/         # 中文内容（名字、描述、背景故事等）
│   └── 0152.json
├── en/            # 英文
├── ja/            # 日文
└── relations/     # 角色关系定义
```

**shared 文件**（`data/characters/shared/你的角色ID.json`）：

```json
{
  "id": "0152",
  "code": "AptS:0152",
  "color": {
    "primary": "#1abc9c",
    "dark": "#16a085"
  },
  "tier": "guest"
}
```

**locale 文件**（`data/characters/zh-CN/你的角色ID.json`）：

```json
{
  "name": "角色姓名",
  "role": "角色定位",
  "species": "种族",
  "quote": "角色引言",
  "description": "一句话简介",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "meta": {
    "background": "角色背景故事",
    "relationship": "与其他角色的关系",
    "abilities": ["能力1", "能力2"],
    "characterTraits": ["性格特征1", "性格特征2"],
    "speechStyle": ["说话方式"],
    "dailyLife": ["日常生活"],
    "specialMoments": ["重要时刻"]
  }
}
```

系统会自动将 shared 和 locale 数据合并。如果某个语言缺少对应文件，会回退到 zh-CN。

### 字段说明

**`tier`** — 角色层级：
- `"core"` — 核心成员，首页和列表页都显示（需要批准）
- `"member"` — 正式成员，只在列表页显示（需要批准）
- `"guest"` — 社区角色（新角色默认使用此值）

**`color`** — 请选择不与现有角色重复的颜色。已使用：

| 颜色 | 色值 | 角色 |
|------|------|------|
| 黄色 | `#ffd93d` | 1547 |
| 粉色 | `#ff69b4` | 1548 |
| 蓝色 | `#4da6ff` | 1549 |
| 绿色 | `#1abc9c` | 0152 |
| 灰色 | `#585858` | 1738 |
| 紫色 | `#8b4fb3` | 4869 |

### 贡献流程

**方式一：提交 Issue（推荐）**

1. 前往 [Issues](https://github.com/The-ESAP-Project/WeAreESAP/issues/new/choose) 创建新 Issue
2. 选择 **"新角色提案"** 模板
3. 填写角色设定
4. 等待审核，通过后我们会帮你创建数据文件

**方式二：Fork & PR**

```bash
# 克隆
git clone https://github.com/你的用户名/WeAreESAP.git
cd WeAreESAP

# 创建分支
git checkout -b add-character-你的角色ID

# 添加角色文件
# → website/data/characters/shared/你的角色ID.json
# → website/data/characters/zh-CN/你的角色ID.json
# → （可选）en/ 和 ja/ 目录下的翻译文件

# 测试
cd website
bun install
bun dev
# 访问 http://localhost:3000/characters 确认显示正常

# 提交
git add website/data/characters/
git commit -m "feat: 添加新角色 - 角色姓名 (ID)"
git push origin add-character-你的角色ID
# 然后在 GitHub 上创建 Pull Request
```

### 审核标准

1. **符合世界观** — 不与 ESAP 核心设定冲突
2. **不与现有角色矛盾** — 背景、关系、颜色不重复
3. **数据格式正确** — JSON 合法，包含所有必需字段
4. **有深度** — 性格鲜明，背景合理

---

## 代码贡献

```bash
cd website
bun install
bun dev
```

### 代码规范

- TypeScript 类型检查
- ESLint 规则（`bun run lint`）
- 函数式组件 + React Hooks
- Tailwind CSS 样式

### PR 流程

1. Fork 并创建分支
2. 确保 lint 通过：`bun run lint`
3. 确保构建成功：`bun run build`
4. 提交有意义的 commit message
5. 创建 Pull Request

### Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 添加角色详情页
fix: 修复移动端菜单显示问题
docs: 更新贡献指南
style: 代码格式调整
refactor: 重构数据加载逻辑
perf: 优化图片加载性能
test: 添加单元测试
chore: 更新依赖
```

---

## 文档与翻译

- 改进现有文档清晰度
- 修正拼写和语法错误
- 翻译内容到其他语言（en、ja）
- 网站内容位于 `website/data/` 和 `website/messages/`

---

## 报告问题

通过 [GitHub Issues](https://github.com/The-ESAP-Project/WeAreESAP/issues/new/choose) 报告：

1. 选择 **"Bug 报告"** 模板
2. 描述问题和复现步骤
3. 提供截图和浏览器/设备信息

---

**The ESAP Project** © 2021–2026 AptS:1547, AptS:1548, and contributors
