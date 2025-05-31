# Use Node.js 18 image, compatible with Mac M1
FROM node:18

# Set working directory
WORKDIR /app

# Install build tools for sqlite3 and bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild sqlite3
RUN npm install && npm rebuild sqlite3 --build-from-source --napi_build_version=8

# Copy application code
ADD . /app

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
