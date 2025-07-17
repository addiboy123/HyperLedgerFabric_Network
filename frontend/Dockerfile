# ✅ Use full Node image (not Alpine)
FROM node:22

# Set working directory
WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# ✅ Explicitly install all dependencies
RUN npm install

# Copy the full source
COPY . .

# ✅ Expose Vite's dev server port
EXPOSE 5173

# ✅ Run Vite directly using `npx` (guaranteed to find it even if not in PATH)
CMD ["npx", "vite", "--host"]
