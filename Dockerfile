# Multi-stage Dockerfile for Next.js 15 + Payload CMS 3.0 (ARM64 & x86_64 compatible)
FROM node:22-bookworm-slim AS base

# Install necessary build tools and libraries for sharp & sqlite
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build Next.js & Payload
FROM base AS builder
WORKDIR /app

# Public build-time values. These are safe to inline; never pass secrets here.
ARG NEXT_PUBLIC_SITE_URL=https://citytourcabs.in
ARG NEXT_PUBLIC_SERVER_URL=https://citytourcabs.in
ARG NEXT_PUBLIC_SITE_NAME="City Tour Cabs"
ARG NEXT_PUBLIC_GADS_CONVERSION_LABEL=4HTzCLqMl6cdENL8iIJF

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_CONFIG_PATH=src/payload.config.ts
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_GADS_CONVERSION_LABEL=$NEXT_PUBLIC_GADS_CONVERSION_LABEL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the standalone Next.js + Payload app
RUN npm run build && rm -rf .next/standalone/data

# Stage 3: Runner
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies for SQLite, images, and privilege management
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    gosu \
    && rm -rf /var/lib/apt/lists/*

# Create user & app directory
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the lockfile-installed native packages for the build platform. Installing
# them at runtime was non-reproducible and hard-coded the ARM64 libsql package.
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/color ./node_modules/color
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/color-convert ./node_modules/color-convert
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/color-name ./node_modules/color-name
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/color-string ./node_modules/color-string
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/simple-swizzle ./node_modules/simple-swizzle
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/is-arrayish ./node_modules/is-arrayish
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@libsql ./node_modules/@libsql

# Copy public assets & static files
COPY --from=builder /app/public ./public

# Copy entrypoint script to ensure permissions on mounted volumes
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
