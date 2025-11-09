\# 贡献指南

感谢你对 ESAP Project 的关注！我们欢迎各种形式的贡献，无论是新角色设定、代码优化、文档改进还是 bug 修复。

---

## 📋 目录

- [行为准则](#行为准则)
- [贡献角色](#贡献角色)
  - [角色数据结构](#角色数据结构)
  - [贡献流程](#贡献流程)
  - [审核标准](#审核标准)
- [代码贡献](#代码贡献)
- [文档贡献](#文档贡献)
- [报告问题](#报告问题)

---

## 行为准则

参与本项目即表示你同意遵守以下准则：

- 尊重所有参与者
- 接受建设性的批评
- 关注对社区最有利的事情
- 保持友善和包容的态度

---

## 贡献角色

我们欢迎社区贡献新的角色设定！在提交之前，请确保你的角色符合 ESAP 的世界观设定。

### 📋 角色数据结构

角色数据存储在 `website/data/characters/{语言}/` 目录下，每个角色一个 JSON 文件。

#### 必需字段

```json
{
  "id": "角色编号（如 0152）",
  "name": "角色姓名",
  "code": "角色代号（如 AptS:0152）",
  "color": {
    "primary": "主题色（十六进制）",
    "dark": "深色调（十六进制）"
  },
  "role": "角色定位",
  "species": "种族/物种",
  "quote": "角色引言",
  "description": "简短描述（一句话）",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "tier": "member"
}
```

#### 可选但推荐字段

```json
{
  "nickname": "角色昵称",
  "backgroundImage": "背景图片路径",
  "meta": {
    "background": "角色背景故事",
    "relationship": "与其他角色的关系",
    "abilities": ["能力1", "能力2"],
    "characterTraits": [
      "性格特征描述1",
      "性格特征描述2"
    ],
    "speechStyle": ["说话方式1", "说话方式2"],
    "dailyLife": ["日常生活描述"],
    "specialMoments": ["重要时刻描述"]
  }
}
```

### 📝 字段说明

#### `tier` - 角色层级
- `"core"` - 核心成员，在首页和角色列表页都显示
- `"member"` - 普通成员，只在角色列表页显示（**新角色默认使用此值**）
- `"guest"` - 访客角色，预留字段

#### `color` - 颜色主题
请选择一个不与现有角色重复的颜色。已使用的颜色：
- 🟡 黄色 `#ffd93d` - 1547（卞雨涵）
- 🩷 粉色 `#ff69b4` - 1548（蔡颖茵）
- 🔵 蓝色 `#4da6ff` - 1549（肖雨昕）
- 🟢 绿色 `#1abc9c` - 0152（顾星澈）
- ⚫ 灰色 `#585858` - 1738（陆清弦）
- 🟣 紫色 `#8b4fb3` - 4869（白漠笙）

#### `keywords` - 关键词
建议 3-4 个关键词，简洁概括角色特质。

### 🔄 贡献流程

#### 方式一：提交 Issue（推荐新手）

1. 前往 [Issues](https://github.com/AptS-1547/WeAreESAP/issues/new/choose) 创建新 Issue
2. 选择模板 **"新角色提案"**
3. 详细填写角色设定信息
4. 等待核心成员审核和反馈
5. 审核通过后，我们会帮你创建角色数据文件

#### 方式二：Fork & Pull Request（推荐有经验的开发者）

1. **Fork 本仓库**到你的 GitHub 账户

2. **克隆到本地**
   ```bash
   git clone https://github.com/你的用户名/WeAreESAP.git
   cd WeAreESAP
   ```

3. **创建新分支**
   ```bash
   git checkout -b add-character-你的角色ID
   ```

4. **添加角色数据文件**
   - 在 `website/data/characters/zh-CN/` 目录下创建新的 JSON 文件
   - 文件名格式：`角色ID.json`（如 `0152.json`）
   - 如果你的角色有其他语言版本，也请在对应语言目录下创建
   - 参考现有角色文件的格式

5. **测试你的角色**
   ```bash
   cd website
   pnpm install
   pnpm dev
   ```
   访问 `http://localhost:3000/characters` 查看你的角色是否正确显示

6. **提交你的更改**
   ```bash
   git add website/data/characters/zh-CN/你的角色ID.json
   git commit -m "feat: 添加新角色 - 角色姓名 (ID)"
   ```

7. **推送到你的 Fork**
   ```bash
   git push origin add-character-你的角色ID
   ```

8. **创建 Pull Request**
   - 前往你的 Fork 页面
   - 点击 "Compare & pull request"
   - 填写 PR 描述，说明角色设定和特点
   - 提交 PR 等待审核

### ✅ 审核标准

你的角色需要满足以下条件才能被接受：

1. **符合世界观设定**
   - 角色设定不与 ESAP 世界观冲突
   - 理解馈散粒子、流体钛等核心设定（如适用）

2. **不与现有角色冲突**
   - 角色背景、关系不与已有角色设定矛盾
   - 颜色主题不重复

3. **完整的数据格式**
   - 包含所有必需字段
   - JSON 格式正确，能通过验证
   - 图片路径正确（如有）

4. **有深度的设定**
   - 角色性格鲜明，有独特特征
   - 有合理的背景故事
   - 关系设定有逻辑性

5. **尊重原作**
   - 尊重核心成员（1547、1548、1549）的设定
   - 不擅自修改他人的角色设定

### 📄 参考示例

查看 `website/data/characters/zh-CN/0152.json` 了解一个完整的角色数据文件应该是什么样的。

---

## 代码贡献

### 开发环境设置

```bash
cd website
pnpm install
pnpm dev
```

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置
- 组件使用函数式组件和 React Hooks
- 使用 Tailwind CSS 进行样式编写

### Pull Request 流程

1. Fork 仓库并创建你的分支
2. 确保代码通过 lint 检查：`pnpm lint`
3. 确保构建成功：`pnpm build`
4. 提交有意义的 commit 信息
5. 推送到你的 Fork 并创建 Pull Request
6. 等待代码审核

### Commit 规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 重构代码
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: 添加角色详情页
fix: 修复移动端菜单显示问题
docs: 更新贡献指南
```

---

## 文档贡献

文档同样重要！你可以：

- 改进现有文档的清晰度
- 修正拼写和语法错误
- 添加缺失的文档
- 翻译文档到其他语言

文档位置：
- 项目文档：`README.md`、`CONTRIBUTING.md`
- 网站内容：`docs/网站文档/`

---

## 报告问题

发现了 bug？请通过 [GitHub Issues](https://github.com/AptS-1547/WeAreESAP/issues/new/choose) 报告：

1. 选择 **"Bug 报告"** 模板
2. 详细描述问题和复现步骤
3. 提供截图（如果可能）
4. 说明你的浏览器和设备信息

---

## 问题？

如果你有任何问题，可以：

- 在 [Discussions](https://github.com/AptS-1547/WeAreESAP/discussions) 发起讨论
- 提交 Issue 询问
- 访问官网 [weare.esaps.net](https://weare.esaps.net)

---

再次感谢你的贡献！

**The ESAP Project** © 2021-2025 by AptS:1547, AptS:1548 and contributors
