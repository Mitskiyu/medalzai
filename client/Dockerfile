FROM node:24.5-alpine AS builder
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile
COPY . .

ARG PUBLIC_API_URL
ARG PUBLIC_HOSTNAME
ARG PUBLIC_PLAUSIBLE_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_HOSTNAME=$PUBLIC_HOSTNAME
ENV PUBLIC_PLAUSIBLE_URL=$PUBLIC_PLAUSIBLE_URL

RUN pnpm build

FROM oven/bun:1.2-alpine
WORKDIR /app

COPY --from=builder /app/build ./build

USER bun

EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "build/index.js"]
