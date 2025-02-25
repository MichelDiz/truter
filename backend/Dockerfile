FROM node:23.8.0-alpine3.20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm install -g rimraf && npm run clean-node-modules

# Remove as dependências de desenvolvimento para otimizar a imagem
RUN npm prune --production

FROM node:23.8.0-alpine3.20

WORKDIR /app

COPY --from=build /app .

EXPOSE 4000

CMD ["/bin/sh", "./scripts/init.sh"]
