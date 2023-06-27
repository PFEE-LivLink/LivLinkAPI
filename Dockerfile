# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Start the application
CMD ["npx", "nest", "start", "-d", "--", "run", "--genDocs", "true"]
