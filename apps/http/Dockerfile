FROM node:22-alpine AS base

# ----------------------
# BUILDER IMAGE
# ----------------------
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm add -g turbo
COPY . .
RUN turbo prune @ridex/http --docker

# ----------------------
# INSTALLER IMAGE
# ----------------------
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/out/json ./
RUN pnpm install

COPY --from=builder /app/out/full/. .
RUN cd ./packages/db && pnpm exec prisma generate --sql

RUN pnpm turbo build --filter=@ridex/http...

# ----------------------
# RUNTIME IMAGE
# ----------------------
FROM base AS runner
WORKDIR /app

# RUN addgroup --system --gid 1001 expressjs && adduser --system --uid 1001 expressjs
# USER expressjs

COPY --from=installer /app ./

CMD ["node" , "apps/http/dist/index.js"]