# syntax=docker/dockerfile:1.7

# 1) Common pnpm-enabled base
FROM node:22-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

# 2) Install workspace dependencies
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# 3) Build the static bundle
FROM deps AS build
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
RUN pnpm --filter @hrtech/web run build

# 4) Serve with nginx; proxy /api → api:3001 (defined in compose network)
FROM nginx:1.27-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1
