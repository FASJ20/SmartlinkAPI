# Use an official Node.js LTS image
FROM node:24.1.0-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app
COPY . .

# Expose the port
EXPOSE 9700

# Start the app
CMD ["npm", "start"]
