# ----------------------
# BASE IMAGE
# ----------------------
FROM node:22-alpine AS base

# system deps
RUN apk update && apk add --no-cache libc6-compat

# enable pnpm & turbo globally
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm add -g turbo

# ----------------------
# BUILDER IMAGE
# ----------------------
# just copy your source here
FROM base AS builder
COPY . .

# ----------------------
# INSTALLER IMAGE
# ----------------------
FROM base AS installer
WORKDIR /app

# get everything from builder
COPY --from=builder /app ./

# install deps
RUN pnpm install

# generate Prisma client (point at your schema)
RUN pnpm exec prisma generate \
  --schema=./packages/db/prisma/schema.prisma \
  --sql

# build only your HTTP app
RUN pnpm turbo build --filter=@ridex/http...

# ----------------------
# RUNTIME IMAGE
# ----------------------
FROM node:22-alpine AS runner

# system deps (if you need any at runtime)
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app
COPY --from=installer /app ./

CMD ["node", "apps/http/dist/index.js"]
