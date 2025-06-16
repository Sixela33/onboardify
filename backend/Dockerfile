# Use Node.js v20 as the base image
FROM node:20-alpine

# Install pnpm and necessary build tools
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies with clean install
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start:prod"]