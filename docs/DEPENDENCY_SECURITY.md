# 依赖安全记录

核查日期：2026-10-22。漏洞结果区分 GitHub 默认分支、当前锁文件和实际部署；本地修复不会直接关闭远端报警，也不会替换既有容器或 Vercel 部署。

## 本次修复

GitHub 当时的 12 条 Dependabot 报警来自三个站点各自声明的 Next.js 16.3.5：以下 4 个漏洞在三个 manifest 中分别计算一次。

| 公告 | 问题 | 修复版本 |
| --- | --- | --- |
| [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) | 图片优化 SSRF | Next.js 16.3.8 |
| [GHSA-f87g-xv8r-7p7x](https://github.com/advisories/GHSA-f87g-xv8r-7p7x) | App Router 元数据图片路由信息泄露 | Next.js 16.3.8 |
| [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) | 自托管 SSG/ISR 缓存投毒 | Next.js 16.3.8 |
| [GHSA-39w2-rjm5-chcv](https://github.com/advisories/GHSA-39w2-rjm5-chcv) | 开发服务器 MCP 端点信息泄露 | Next.js 16.3.8 |

锁文件审计另发现 Next.js 的 `next/og` ImageResponse 远程代码执行，以及草稿内容和 SSG/ISR 缓存相关漏洞，同次补丁一并修复。其他有可用补丁的依赖更新如下：

- sharp 0.35.5：修复其 librsvg 依赖的 CVE-2026-96889。
- source-map-js 1.2.2：修复 indexed source map 处理中的事件循环拒绝服务。
- Vite 8.3.4：修复开发服务器文件访问、跨域脚本执行及编辑器命令处理漏洞。

选择同一维护线的安全补丁，`@next/bundle-analyzer` 与 Next.js 对齐。候选包的 npm 注册表签名已验证；保留 `minimumReleaseAge: 1440` 和 `trustPolicy: no-downgrade`，不为本次更新添加发布冷却期例外。

## 尚无修复的构建依赖

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)：`braces <=3.0.3` 对深度嵌套的 brace pattern 缺少递归深度保护，可导致调用栈耗尽。核查时 npm 最新版仍为 3.0.3，公告没有已修复版本。

唯一依赖链为：

```text
weare-website (devDependencies)
  -> next-sitemap 4.2.3
  -> fast-glob 3.3.3
  -> micromatch 4.0.8
  -> braces 3.0.3
```

当前 `next-sitemap` 在构建后生成 sitemap。其 `ManifestParser.getStaticExportPages()` 仅在配置为 `output: export` 时，使用构建目录拼接固定的 `/**/*.html` glob；本仓库采用 standalone，并且不接收访客提供的 glob。该包不属于站点请求处理流程。由此限制了当前调用路径的暴露范围，**不代表上游漏洞已经修复**。

保留该审计结果，不添加忽略项或伪造已修复版本。后续上游发布补丁后更新锁文件；若构建开始接受外部 glob 或切换静态导出，应重新评估。审计命令的全依赖结果仍可能因这一项返回非零；运行时依赖另用 `pnpm audit --prod` 检查，CI 也执行这一检查，出现生产依赖漏洞时直接失败。

## 复核命令

在仓库根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm audit
pnpm audit --prod
pnpm why --recursive braces
pnpm peers check
```

合入并推送默认分支后，再通过 Dependabot 核验报警是否关闭；部署后还需检查新构建使用的 Next.js 和 sharp 版本。
