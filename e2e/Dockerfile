FROM golang:1.23.4-alpine
RUN apk update && apk add --no-cache chromium git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

ENV ROD_BROWSER_BIN=/usr/bin/chromium-browser
