# data/stories 目录说明

## 目录结构

```plaintext
data/stories/
├── shared/
│   ├── index.json              # 故事注册表（全局索引）
│   ├── collections/
│   │   └── index.json          # 合集注册表
│   └── {slug}/
│       └── meta.json           # 故事结构数据（非翻译字段）
├── zh-CN/
│   ├── {slug}/
│   │   ├── info.json           # 中文翻译内容
│   │   └── {chapterId}.json    # 章节内容
│   └── collections/
│       └── {slug}.json         # 合集翻译内容
├── en/
│   └── ...                     # 同上，英文
└── ja/
    └── ...                     # 同上，日文
```

## 文件职责

### `shared/index.json`

故事列表，仅存放索引信息，用于列表页排序。

```json
[
  { "slug": "story-slug", "order": 0 }
]
```

### `shared/{slug}/meta.json`

故事的结构数据，与语言无关，所有 locale 共享。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `format` | `"serial" \| "collection" \| "interactive"` | 故事格式 |
| `status` | `"draft" \| "ongoing" \| "completed" \| "hiatus"` | 连载状态 |
| `coverImage` | `string` | 封面图路径 |
| `authors` | `string[]` | 作者（角色编号） |
| `relatedCharacters` | `string[]` | 相关角色（角色编号） |
| `publishedAt` | `string` | 首次发布时间（ISO 8601） |
| `updatedAt` | `string` | 最后更新时间（ISO 8601） |
| `tags` | `string[]` | 标签 |
| `chapterOrder` | `string[]` | 章节顺序（chapterId 列表） |
| `perspectives` | `PerspectiveDefinition[]` | 视角变体定义（可选） |
| `unlocks` | `UnlockDefinition[]` | 解锁条件定义（可选） |
| `explorationScenes` | `string[]` | 探索场景 ID 列表（可选） |

### `{locale}/{slug}/info.json`

可翻译的文字内容，每个语言版本单独维护。缺失时自动回退到 `zh-CN`。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `title` | `string` | 故事标题 |
| `subtitle` | `string` | 副标题（可选） |
| `description` | `string` | 简短描述，用于卡片展示 |
| `synopsis` | `string` | 长摘要，优先用于 SEO meta description（可选） |
| `warnings` | `string[]` | 内容警告（可选） |

### `{locale}/{slug}/{chapterId}.json`

章节内容，类型定义见 `types/chapter.ts`。

---

## 新增故事

1. 在 `shared/index.json` 追加一条记录：

   ```json
   { "slug": "your-story-slug", "order": N }
   ```

2. 创建 `shared/your-story-slug/meta.json`，填入结构数据。

3. 创建 `zh-CN/your-story-slug/info.json`，填入中文内容。如有其他语言版本，在对应 locale 目录下创建同名文件。

4. 按 `chapterOrder` 中定义的顺序，在各 locale 目录下创建章节文件 `{chapterId}.json`。

---

## locale 回退规则

- `ja` 缺失时回退到 `en`
- `en` 缺失时回退到 `zh-CN`
- `zh-CN` 为最终兜底，必须存在
