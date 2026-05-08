# Use Node.js as the base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Set up the backend
WORKDIR /app/backend
RUN npm install

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
