FROM node:24.5-alpine AS builder
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile
COPY . .

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

RUN pnpm build

FROM node:24.5-alpine
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/build ./build

RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001 -G nodejs
USER sveltekit

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
