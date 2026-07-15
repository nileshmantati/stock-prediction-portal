# ─── Stage 1: Build React app ──────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Build-time env vars (baked into the bundle by Vite)
# Nginx will proxy /api/ → backend, so we use relative paths
ARG VITE_BACKEND_BASE_API=/api/v1
ARG VITE_BACKEND_ROOT=
ENV VITE_BACKEND_BASE_API=$VITE_BACKEND_BASE_API
ENV VITE_BACKEND_ROOT=$VITE_BACKEND_ROOT

COPY . .
RUN npm run build


# ─── Stage 2: Serve with Nginx ─────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
