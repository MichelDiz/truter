FROM golang:1.20

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    libnss3 \
    libatk1.0-0 \
    libpangocairo-1.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    libpango1.0-0 \
    libgtk-3-0 \
    ca-certificates \
    chromium

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o e2e-tests .

CMD ["./e2e-tests"]
