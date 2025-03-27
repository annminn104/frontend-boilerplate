FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN  pnpm i -g turbo@2.4.4
COPY . .
RUN turbo prune @apps/landing --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --ignore-scripts

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn turbo run build --filter=landing...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/landing/next.config.ts .
COPY --from=installer /app/apps/landing/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/maruhachi/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/public ./apps/maruhachi/public

EXPOSE 5001

ENV PORT 5001

CMD node apps/landing/server.js