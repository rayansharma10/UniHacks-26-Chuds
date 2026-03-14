FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

CMD ["./node_modules/.bin/serve", "dist", "--single", "-l", "tcp://0.0.0.0:3000"]
