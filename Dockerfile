#Build stage
FROM node:22-alpine3.21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on (if needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]