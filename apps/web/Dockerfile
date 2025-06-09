# ----------------------
# BASE IMAGE
# ----------------------
FROM node:22-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# enable pnpm & turbo globally
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm add -g turbo

# ----------------------
# BUILDER IMAGE
# ----------------------
FROM base AS builder
# pull in your entire repo
COPY . .

# ----------------------
# INSTALLER IMAGE
# ----------------------
FROM base AS installer
WORKDIR /app

# bring in all source files
COPY --from=builder /app ./

# install dependencies
# drop frozen-lockfile if it causes mismatches
RUN pnpm install --no-frozen-lockfile

# generate Prisma client (point at your schema)
RUN pnpm exec prisma generate \
  --schema=./packages/db/prisma/schema.prisma \
  --sql

# build only the web app
RUN pnpm turbo build --filter=@ridex/web...

# ----------------------
# RUNTIME IMAGE
# ----------------------
FROM node:22-alpine AS runner
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# copy Next.js standalone output & static assets
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
