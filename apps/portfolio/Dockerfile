FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN  pnpm i -g turbo@2.4.4
COPY . .
RUN turbo prune @apps/portfolio --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --ignore-scripts

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo run build --filter=portfolio...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/portfolio/next.config.ts .
COPY --from=installer /app/apps/portfolio/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/.next/static ./apps/portfolio/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/public ./apps/portfolio/public

EXPOSE 5001

ENV PORT 5001

CMD node apps/portfolio/server.js