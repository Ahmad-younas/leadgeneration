# Stage 1: Build the Node.js application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies inside the container
RUN npm install --legacy-peer-deps

# Copy the source code into the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create a lightweight production image for Node.js
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and lock file for a clean environment
COPY package*.json ./

# Reinstall only production dependencies
RUN npm install --legacy-peer-deps


# Copy the build files from the build stage
COPY --from=build /app/build ./build

# Expose the port your application runs on
EXPOSE 5000

# Set the default command to start your server
CMD ["node", "build/src/index.js"]
