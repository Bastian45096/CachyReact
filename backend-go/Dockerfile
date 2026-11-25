# ============================================
# Backend Go — GoCachy API
# ============================================

# Etapa 1: Compilar
FROM golang:1.27-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/api

# Etapa 2: Imagen final ligera
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
ENV GIN_MODE=release

CMD ["./server"]