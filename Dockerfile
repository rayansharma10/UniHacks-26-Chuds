FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN VITE_API_URL=https://backend-production-488c.up.railway.app npm run build

CMD ["./node_modules/.bin/serve", "dist", "--single", "-l", "tcp://0.0.0.0:3000"]
