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
RUN turbo prune @ridex/web --docker

# ----------------------
# INSTALLER IMAGE
# ----------------------
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/out/json ./
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/. .
RUN cd ./packages/db && pnpm exec prisma generate --sql
RUN pnpm turbo build --filter=@ridex/web...

# ----------------------
# RUNTIME IMAGE
# ----------------------
FROM base AS runner
WORKDIR /app

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

COPY --from=installer --chown=user:nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD [ "node" , "apps/web/server.js" ]
