# 未发布

## 安全

- **Node.js 运行时升级** — 三个站点、本地工具链和 CI 统一到最新 LTS 24.22.1，最低版本要求为 `>=24.22.1 <25`，包含 CVE-2026-111497（Brotli 解码器越界写入）及同批安全修复；CI Action 同步升级至使用 Node 24 的当前版本。Docker 构建固定该补丁版本，并检查 distroless 运行时达到安全基线。Vercel 使用 Node 24，补丁分发及新部署的实际运行时仍需在平台验证。

## 部署变更

- **统一 workspace 部署入口** — Docker 从仓库根目录使用共享锁文件构建，三个站点均提供非 root distroless 镜像；standalone 包保留 workspace 路径，构建与运行环境统一 Debian/glibc，支持自定义端口健康检查。CI 覆盖三个站点及镜像。升级现有部署需要重新构建并替换容器，或更新宿主机 Node 后重启应用；详见[部署指南](../DEPLOYMENT.md)。

[与上一版本 3.0.0 比较](https://github.com/The-ESAP-Project/WeAreESAP/compare/3.0.0...HEAD)
