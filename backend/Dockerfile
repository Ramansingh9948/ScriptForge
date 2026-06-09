# Use a slim Node.js base image
FROM node:20-bookworm-slim

# Install system dependencies: FFmpeg and DejaVu fonts (needed for caption drawing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install packages
RUN npm ci

# Copy application source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose backend port
EXPOSE 5000

# Set production environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Start the Express server
CMD [ "npm", "start" ]
