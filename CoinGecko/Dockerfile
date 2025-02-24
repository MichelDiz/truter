FROM golang:1.23.4-alpine as builder


WORKDIR /app

COPY . .

RUN go mod download
RUN go build -o mock-api

FROM golang:1.23.4-alpine

WORKDIR /app

COPY --from=builder /app/mock-api .

EXPOSE 8082

CMD ["./mock-api"]
