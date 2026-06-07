FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# Directorio para la base de datos SQLite
RUN mkdir -p /app/data

ENV DB_PATH=/app/data/padelzgz.db

EXPOSE 3001

CMD ["node", "src/index.js"]
