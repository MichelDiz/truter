FROM golang:1.23.4-alpine
RUN apk update && apk add --no-cache chromium git docker npm

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

# Configura diretórios temporários para o Chromium
RUN mkdir -p /tmp/.config /tmp/.cache && chmod -R 777 /tmp/.config /tmp/.cache

ENV ROD_BROWSER_BIN=/usr/bin/chromium-browser
