# Stage 1: Build frontend
FROM node:16.16.0 AS frontend-builder

WORKDIR /app

COPY . /app

RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 3: Create production image with NGINX
FROM nginx:latest

# Copy built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy NGINX configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose the port the app runs on
EXPOSE 80

# Start NGINX and the Node.js app
CMD ["nginx", "-g", "daemon off;"]