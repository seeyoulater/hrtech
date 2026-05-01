# syntax=docker/dockerfile:1.7

# 1) Common pnpm-enabled base
FROM node:22-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

# 2) Install dependencies (cached on lockfile + manifests)
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# 3) Build the api (tsc → apps/api/dist)
FROM deps AS build
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter @hrtech/api run build

# 4) Use pnpm deploy to produce a self-contained, prod-only directory
FROM build AS deploy
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm --filter @hrtech/api --prod deploy /deploy

# 5) Slim runtime image
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001
COPY --from=deploy /deploy ./
EXPOSE 3001
# Use shell form so $PORT expands at runtime — Sliplane (and other
# PaaS) inject PORT, the Fastify server listens on it, and the
# healthcheck has to follow. Falls back to 3001 if PORT isn't set.
# `127.0.0.1` instead of `localhost` because alpine resolves
# `localhost` to ::1 (IPv6) and Fastify is bound to IPv4.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget --quiet --tries=1 --spider "http://127.0.0.1:${PORT:-3001}/api/health" || exit 1
USER node
CMD ["node", "--env-file-if-exists=.env", "dist/server.js"]
