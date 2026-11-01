# Multi-app Dockerfile — build with: --build-arg APP=web|admin
FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

ARG APP=web
ENV CI=true

# Install deps with the workspace lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/db/package.json packages/db/package.json
RUN pnpm install --frozen-lockfile

# Build
COPY packages ./packages
COPY apps/${APP} ./apps/${APP}
ENV DATABASE_URL="file:/app/data/app.db"
RUN pnpm --filter @iconic/db db:generate
RUN pnpm --filter ${APP} build

ENV NODE_ENV=production
ENV APP_NAME=${APP}
EXPOSE 3000
CMD ["sh", "-c", "pnpm --filter ${APP_NAME} start"]
