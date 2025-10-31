# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your project
COPY . .

# Build the production version of the app
RUN npm run build

# Expose Astro’s default port
EXPOSE 3000

# Start the preview server
CMD ["npm", "run", "preview"]
