# Build from the monorepo root: docker build --pull -f story-website/Dockerfile .
FROM node:24.22.1-bookworm-slim AS builder

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Keep workspace dependency resolution identical to local and CI installs.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared-ui/package.json ./packages/shared-ui/package.json
COPY weare-website/package.json ./weare-website/package.json
COPY story-website/package.json ./story-website/package.json
COPY esap-ltd/package.json ./esap-ltd/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false --store-dir=/pnpm/store

COPY . .

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://story.esaps.net
ENV NODE_ENV=production \
    NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE=false \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"
RUN pnpm --dir story-website run build

# Match the builder's glibc/Debian ABI for native dependencies such as sharp.
FROM gcr.io/distroless/cc-debian12:nonroot AS runner

# Distroless Node tags can lag security releases. Use the exact patched binary.
COPY --from=builder /usr/local/bin/node /nodejs/bin/node

# Verify the actual executable shipped in the final runtime image.
RUN ["/nodejs/bin/node", "-e", "const [major,minor,patch]=process.versions.node.split('.').map(Number); if (major!==24 || minor<22 || (minor===22 && patch<1)) throw new Error('Node.js >=24.22.1 <25 is required'); console.log(process.version)"]

LABEL maintainer="AptS:1547, AptS:1548 <esaps@esaps.net>"
LABEL description="ESAP Stories - Interactive Sci-Fi Story Platform"
USER nonroot:nonroot
WORKDIR /app/story-website

ARG PORT=3000
ARG NEXT_PUBLIC_SITE_URL=https://story.esaps.net
ENV NODE_ENV=production \
    NEXT_PUBLIC_DEBUG_HIDDEN_PROFILE=false \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    PORT=${PORT} \
    HOSTNAME="0.0.0.0"

# standalone now includes the workspace root and each site's server subdirectory.
COPY --from=builder --chown=nonroot:nonroot /app/story-website/.next/standalone /app
COPY --from=builder --chown=nonroot:nonroot /app/story-website/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/story-website/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/story-website/data ./data

VOLUME ["/app/story-website/.next/cache"]
EXPOSE ${PORT}

# Distroless has no shell; use exec form and read PORT inside Node.js.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/nodejs/bin/node", "-e", "const req=require('http').get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/'},r=>{r.resume();process.exit(r.statusCode===200?0:1)});req.setTimeout(2000,()=>{req.destroy();process.exit(1)});req.on('error',()=>process.exit(1))"]

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["server.js"]
