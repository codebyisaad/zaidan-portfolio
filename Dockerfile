FROM node:23-alpine AS base

WORKDIR /app

# Copy package management files
COPY package.json package-lock.json ./

# Install dependencies securely and handle peer dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Set Astro DB file path for local production builds
ENV ASTRO_DATABASE_FILE=/app/data/local.db

# Build the Astro project
RUN mkdir -p /app/data && npm run build

# Start a new, smaller stage for the runtime
FROM node:23-alpine AS runtime

WORKDIR /app

# Copy built files and production modules from the base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./

# Set necessary environment variables for Astro
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
ENV ASTRO_DATABASE_FILE=/app/data/local.db

# Copy the local database generated during build to a safe initial directory
COPY --from=base /app/data /app/initial-data

# Expose the port the app runs on
EXPOSE 4321

# Start the Node.js server, ensuring the database is copied to the volume if it's missing
CMD ["sh", "-c", "if [ ! -f /app/data/local.db ]; then cp /app/initial-data/local.db /app/data/local.db; fi && node ./dist/server/entry.mjs"]
