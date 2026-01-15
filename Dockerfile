FROM node:22.17.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs package.json ./
COPY --chown=nextjs:nodejs pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]