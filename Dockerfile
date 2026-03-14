# ==========================================
# STAGE 1: Build the Angular App
# ==========================================
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies first (caching layer)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the project for production.
RUN npm run build -- --configuration production --base-href /admin/

# ==========================================
# STAGE 2: Serve with Nginx Alpine
# ==========================================
FROM nginx:alpine3.23-slim

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom SPA routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled Angular build from Stage 1
COPY --from=build /app/dist/Hive-Keeper-UI/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
