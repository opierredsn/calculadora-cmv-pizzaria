# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY public/ ./public/
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]