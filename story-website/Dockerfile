# ============================================
# Build stage
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://story.esaps.net

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm run build


# ============================================
# Runtime stage
# ============================================
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner

LABEL maintainer="AptS:1547, AptS:1548 <esaps@esaps.net>"
LABEL description="ESAP Stories - Interactive Sci-Fi Story Platform"

USER nonroot:nonroot

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://story.esaps.net

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/data ./data

VOLUME ["/home/nonroot/.next/cache"]

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /nodejs/bin/node -e "require('http').get('http://localhost:${PORT}/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["server.js"]
