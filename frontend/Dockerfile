FROM node:23.8.0-alpine3.20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:23.8.0-alpine3.20

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist /app/dist

EXPOSE 5173

CMD ["serve", "-s", "/app/dist", "-l", "5173"]
