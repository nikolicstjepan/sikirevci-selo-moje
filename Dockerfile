# syntax=docker/dockerfile:1
# Build stage (Bullseye has libssl1.1 required by Prisma 4.x)
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Install dependencies (layer cache)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* are inlined at build time; must be set here so client bundle has correct image URLs.
# Override with: docker build --build-arg NEXT_PUBLIC_FILE_BASE_PATH=... ...
ARG NEXT_PUBLIC_FILE_BASE_PATH=https://eu2.contabostorage.com/5d5c7bc98ba045af8a7a1e2bc04e891e:sikirevci/sikirevci
ENV NEXT_PUBLIC_FILE_BASE_PATH=$NEXT_PUBLIC_FILE_BASE_PATH

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy built app and runtime deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# So nextjs user can create prisma/db.sqlite (SQLite)
RUN chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy && exec npm start"]
