FROM node:23-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy full project
COPY . .

# Build Astro project
RUN npm run build


# -------------------------
# Runtime stage (smaller)
# -------------------------
FROM node:23-alpine AS runtime

WORKDIR /app

# Copy only what we need for production
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/drizzle.config.ts ./
COPY --from=base /app/src/db/schema.ts ./src/db/schema.ts

# Environment
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Expose port
EXPOSE 4321

# Start server (with automated DB push if DATABASE_URL is present)
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then npm run db:push; fi && node ./dist/server/entry.mjs"]