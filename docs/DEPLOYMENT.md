# 部署与 Node.js 安全版本

三个站点共用仓库根目录的 `pnpm-lock.yaml`、`pnpm-workspace.yaml` 和 `packageManager`。安装依赖和 Docker 构建都以仓库根目录为入口。

## 版本基线

截至 2026-10-22，采用最新 LTS **Node.js 24.22.1**，最低允许 `>=24.22.1 <25`；包管理器保持 **pnpm 12.4.1**。根目录和三个站点的 `engines.node` 均声明该范围，`.npmrc` 的 `engine-strict=true` 拒绝不符合版本要求的安装。`.nvmrc`、`.node-version` 和 CI 固定到 24.22.1。

[Node.js 2026-10-21 安全公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)确认 CVE-2026-111497 为 Brotli 解码器越界写入，可能导致远程代码执行；修复版本为 22.23.4、24.22.1 和 26.12.1。本仓库选择 Vercel 支持的最新 LTS 24.22.1，后续 24.x 补丁可通过 `engines` 约束。不要继续运行旧镜像中的 Node.js，也不要只更新 `@types/node` 就认为运行时已经修复。

## 本地开发与宿主机部署

```bash
# 仓库根目录
nvm install
nvm use
node --version # v24.22.1
corepack enable
pnpm install --frozen-lockfile
pnpm --dir weare-website run build
pnpm --dir story-website run build
pnpm --dir esap-ltd run build
```

使用其他版本管理器时，将 Node 设置为 `.node-version` 声明的版本（若管理器不自动识别该文件，需要显式配置）。裸机或进程管理器部署需要升级**实际启动应用的 Node 可执行文件**并重启进程；交互终端的 `node --version` 不能证明服务进程也已经更新。

三个站点均输出 monorepo standalone 包。手动部署时复制整个 `<site>/.next/standalone/`，再把 `<site>/.next/static/`、`<site>/public/` 和 `<site>/data/` 放到包内对应站点目录，保留根目录的 `node_modules` 和 workspace 结构。进入包内 `<site>/` 目录，用已修复的 Node 运行 `server.js`。原生依赖必须在与目标系统相同的 OS、架构和 libc 环境中构建；不要把 macOS 构建产物直接搬到 Linux。

## Docker

三个站点均提供 Dockerfile，从仓库根目录运行：

```bash
docker build --pull -f weare-website/Dockerfile -t weare-esap .
docker build --pull -f story-website/Dockerfile -t esap-stories .
docker build --pull -f esap-ltd/Dockerfile -t esap-ltd .

docker run -d --name weare-esap -p 3000:3000 weare-esap
docker run -d --name esap-stories -p 3001:3000 esap-stories
docker run -d --name esap-ltd -p 3002:3000 esap-ltd
```

构建镜像固定 `node:24.22.1-bookworm-slim`，运行镜像使用 `gcr.io/distroless/cc-debian12:nonroot`，从构建镜像复制官方 Node 24.22.1 可执行文件。两阶段均使用 Debian/glibc，保留 distroless 和非 root 运行。构建时直接执行最终镜像中的 Node 检查 `>=24.22.1 <25`，未达到安全基线则拒绝构建。2026-10-22 拉取的 `distroless/nodejs24-debian12:nonroot` 实际仍为 24.14.0，因此不再依赖该标签的 Node 更新进度。每次部署使用 `--pull` 拉取运行基础镜像，应用镜像仍须重新构建并替换已有容器。

健康检查使用无需 shell 的 exec 形式，读取容器的 `PORT`；默认 3000，也支持如 `-e PORT=3080 -p 3080:3080`。CI 为三个镜像分别验证实际 Node 版本及非默认端口下的容器健康状态。

```bash
docker run --rm weare-esap --version
docker exec weare-esap /nodejs/bin/node --version
docker inspect --format '{{.State.Health.Status}}' weare-esap
```

检查运行容器应为 Node.js 24.22.1 或更新的 24.x，健康状态应为 `healthy`，并访问首页、角色/章节页面和静态资源验证实际服务。

## Vercel

每个项目的 Root Directory 分别为 `weare-website`、`story-website`、`esap-ltd`，允许构建访问根目录与共享包。保留根目录 `packageManager: pnpm@12.4.1` 和 frozen lockfile 安装。

[Vercel Node.js 版本文档](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)目前列出 24.x 和 22.x，最高为 24.x；平台仅允许选择主版本，补丁版本由 Vercel 自动分发。三个站点的 `engines.node: ">=24.22.1 <25"` 选择 Node 24 并覆盖项目中的旧主版本设置。

提交升级后需为三个项目创建新部署。检查构建日志中的 `node --version`，同时检查部署详情中的函数运行时版本或对应平台的安全补丁公告。仓库的 `engines` 声明和本地构建通过不能证明平台已经为函数分发补丁；如果实际运行时低于 24.22.1，应等待平台修复或先部署到已验证的 Docker/宿主机环境。旧部署不会因为代码里的版本约束改变而自动替换。

## 持续集成

GitHub Actions 从 `.nvmrc` 读取 Node 版本，从根目录 `packageManager` 读取 pnpm 版本，使用根锁文件缓存。检查覆盖共享组件和三个站点的 Biome、单元测试、生产构建，以及三个 Docker 镜像。Playwright 运行 weare-website 的 Chromium、Firefox 和 Mobile Chrome 测试。

CI Action 更新为官方当前版本：checkout 7.0.1、setup-node 7.1.0、upload-artifact 7.0.2、pnpm/action-setup 6.1.0，均声明使用 Node 24。Action 自身携带的 Node 补丁由 GitHub Runner 提供，与 `setup-node` 为项目安装的 Node 是两套运行时；GitHub 托管 Runner 的补丁状态仍需由平台保证。
