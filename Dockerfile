FROM node:23-alpine AS base

WORKDIR /app

# Copy package management files
COPY package.json package-lock.json ./

# Install dependencies securely and handle peer dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the Astro project
RUN npm run build

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

# Expose the port the app runs on
EXPOSE 4321

# Start the Node.js server
CMD ["node", "./dist/server/entry.mjs"]
