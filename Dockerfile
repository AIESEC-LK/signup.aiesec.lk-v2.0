# Multi-stage build for production optimization
FROM node:22-alpine AS base

# Dependencies stage - install all dependencies for building
FROM base AS deps
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Builder stage - build the Vite application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Build the application
RUN echo "Starting build process..." && \
    echo "Current directory: $(pwd)" && \
    echo "Files in current directory:" && ls -la && \
    echo "Vite config:" && cat vite.config.js && \
    echo "Node version:" && node --version && \
    echo "NPM version:" && npm --version && \
    npm run build && \
    echo "Build completed. Checking dist output..." && \
    ls -la dist/ && \
    if [ -d "dist" ]; then \
      echo "Dist output found:" && ls -la dist/; \
    else \
      echo "ERROR: Dist output not found!" && exit 1; \
    fi

# Production image - serve static files with Nginx
FROM nginx:alpine AS runner

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 --ingroup appgroup appuser

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set correct permissions for non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

ENV PORT=80

CMD ["nginx", "-g", "daemon off;"]
