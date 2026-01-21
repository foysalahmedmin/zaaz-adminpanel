# =========================
# Stage 1: Build
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_APP_URL

# Set as environment variables for Vite build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_URL=$VITE_APP_URL

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# =========================
# Stage 2: Production
# =========================
FROM node:18-alpine AS production

WORKDIR /app




# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json only (no lockfile needed for single package install)
COPY package.json ./

# Install only vite for preview (lightweight)
RUN pnpm install vite

# Copy vite config for preview
COPY vite.config.ts ./

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 8080 (matching vite.config.ts)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Use vite preview from package.json (matches the preview script)
CMD ["pnpm", "run", "preview"]

