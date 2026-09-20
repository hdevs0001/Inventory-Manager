# ===================
# STAGE 1: BASE IMAGE
# ===================

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY skills-lock.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY src ./src
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
RUN npx prisma generate
RUN npm run build

# ===================
# STAGE 2: PRODUCTION
# ===================

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup  && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/src/generated ./dist/generated
RUN mkdir -p logs && chown -R appuser:appgroup logs

USER appuser
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:3001/health',(res)=> process.exit(res.statusCode === 200 ? 0 : 1)).on('error',()=>process.exit(1))"

CMD [ "node","dist/server.js" ]