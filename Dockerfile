# Use Node.js as the base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies (including production dependencies for tsx)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Start the application using the root start script
CMD ["npm", "start"]
