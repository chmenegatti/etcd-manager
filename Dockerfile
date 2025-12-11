# Multi-stage build for Next.js + etcd3 client
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable
COPY package.json yarn.lock* ./
# Try frozen install when a lock exists; fall back to regular install otherwise
RUN yarn install --non-interactive --frozen-lockfile || yarn install --non-interactive

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
ENV PORT=3000
# Defaults for in-cluster etcd; override as needed
ENV ETCD_ENDPOINT=http://nemesis-etcd:2379
ENV NEXT_PUBLIC_ETCD_ENDPOINT=nemesis-etcd:2379
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
