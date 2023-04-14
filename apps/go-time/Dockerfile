# Build stage
# Pin the minor version
FROM golang:1.20-alpine AS builder

WORKDIR /app
COPY . .

# Build the `main` binary
RUN go build -o main

# Final stage
# Pin the minor version
FROM alpine:3.17

# Add the ca-certificates package to the container
RUN apk --no-cache add ca-certificates
# Copy the `main` binary from the build stage
COPY --from=builder /app/main /app/main

# Expose the service port
EXPOSE 8080

# Run the service
CMD ["/app/main"]
