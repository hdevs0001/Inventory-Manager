
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY vite.config.ts ./
COPY postcss.config.cjs ./
COPY tailwind.config.js ./
COPY components.json ./
COPY eslint.config.js ./
COPY index.html ./
COPY src ./src
COPY tsconfig*.json ./
COPY public ./public

RUN npm run build

# =======================
# STAGE 2: PRODUCTION
# =======================

FROM nginxinc/nginx-unprivileged:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]