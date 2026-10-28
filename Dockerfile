# Multi-stage or lightweight Node.js 22 Alpine production container
FROM node:22-alpine AS runner

WORKDIR /app

# Install dependencies (utilizing layer caching)
COPY package*.json ./
RUN npm ci --omit=optional

# Copy application source code
COPY . .

# Generate evidentiary media and build frontend distribution
RUN node server/generateSampleMedia.js && npm run build

# Configure production environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port (can be overridden by cloud platform via $PORT)
EXPOSE 5000

# Launch full-stack platform
CMD ["node", "server/index.js"]
