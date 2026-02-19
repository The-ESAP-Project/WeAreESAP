# ============================================
# Build stage
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

# 启用 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://weare.esaps.net

# 构建时环境变量
ENV NODE_ENV=production \
    NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE=false \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 frozen-lockfile 确保一致性）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# 复制源代码
COPY . .

# 构建应用（Next.js standalone 模式）
RUN pnpm run build


# ============================================
# Runtime stage
# ============================================
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner

LABEL maintainer="AptS:1547, AptS:1548 <esaps@esaps.net>"
LABEL description="We Are ESAP - The ESAP Project Website"

USER nonroot:nonroot

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://weare.esaps.net

# 运行时环境变量
ENV NODE_ENV=production \
    NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE=false \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"

# 从 builder 复制构建产物
# Next.js standalone 输出会生成一个最小化的服务器
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public

# 复制数据文件（角色 JSON）
COPY --from=builder --chown=nonroot:nonroot /app/data ./data

VOLUME ["/home/nonroot/.next/cache"]

EXPOSE ${PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /nodejs/bin/node -e "require('http').get('http://localhost:${PORT}/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动 Next.js 服务器
CMD ["server.js"]
