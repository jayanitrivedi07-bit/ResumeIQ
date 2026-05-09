# Use Node.js as the base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files for better caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install all dependencies (we need devDeps to build frontend)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Cloud Run uses the PORT environment variable.
# We expose 8080 as a default, but the app listens on process.env.PORT
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
