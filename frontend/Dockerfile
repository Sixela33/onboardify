# Use Node.js v20 as the base image
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 5173

# Start the application in development mode
# Note: Using dev instead of preview to enable HMR
CMD ["pnpm", "run", "dev", "--host"]