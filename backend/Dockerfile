FROM node:23.8.0-alpine3.20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN chmod +x ./scripts/init.sh

EXPOSE 4000

CMD ["/bin/sh", "./scripts/init.sh"]
