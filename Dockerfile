# Multi-stage Dockerfile for Vite React app
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy built app
COPY --from=builder /app/dist .

# Copy optimized nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
