# 1. Base image with Node.js
FROM node:22-alpine

# 2. Create app directory
WORKDIR /app

# 3. Copy package.json and install deps
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Build TypeScript to JavaScript
RUN npm run build

# 6. Expose the app port
EXPOSE 80

# 7. Run the app (compiled JS from /dist)
CMD ["npm", "start"]
