FROM node:current-alpine
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY . .
