# Use latest stable Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose frontend dev server port (Vite default)
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host"]

