# Use Node LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source
COPY . .

# Expose backend port
EXPOSE 5000

# Run the server
CMD ["node", "server.js"]
