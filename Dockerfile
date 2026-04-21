# ── Stage 1: Base ─────────────────────────────────
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl  
COPY package*.json ./

# ── Stage 2: Development ──────────────────────────
FROM base AS development
RUN npm ci
COPY . .
RUN npx prisma generate 
EXPOSE 3000
CMD ["npm", "run", "docker:dev"]

# ── Stage 3: Builder ──────────────────────────────
FROM base AS builder
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Stage 4: Production ───────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "docker:prod"]