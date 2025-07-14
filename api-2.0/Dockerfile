FROM node:16-bullseye-slim

# Install build dependencies for grpc
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose your REST API port
EXPOSE 4000

CMD ["node", "app.js"]


# docker build -t fabric-rest-server ./api-2.0
# docker run -p 4000:4000 -v $(pwd)/artifacts:/usr/src/app/artifacts --network test fabric-rest-server