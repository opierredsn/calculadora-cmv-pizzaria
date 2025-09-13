# Dockerfile para debug do erro
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install basic tools for debugging
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Show package.json content
RUN echo "=== PACKAGE.JSON ===" && cat package.json

# Install dependencies with verbose output
RUN npm ci --verbose

# Show installed packages
RUN npm list --depth=0

# Copy source code
COPY . .

# Show project structure
RUN echo "=== PROJECT STRUCTURE ===" && find . -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" | head -20

# Check if main files exist
RUN echo "=== CHECKING MAIN FILES ===" && \
    ls -la public/ || echo "No public folder" && \
    ls -la src/ || echo "No src folder" && \
    ls -la src/index.js || ls -la src/index.jsx || ls -la src/index.ts || ls -la src/index.tsx || echo "No main index file found"

# Set NODE_OPTIONS for build
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Try build with maximum verbosity
RUN echo "=== STARTING BUILD ===" && \
    npm run build 2>&1 | tee build.log || (echo "=== BUILD FAILED ===" && cat build.log && exit 1)