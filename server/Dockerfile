FROM lukemathwalker/cargo-chef:latest-rust-1.89.0-alpine AS planner
WORKDIR /app

COPY Cargo.toml Cargo.lock ./
RUN cargo chef prepare --recipe-path recipe.json

FROM lukemathwalker/cargo-chef:latest-rust-1.89.0-alpine AS builder
WORKDIR /app

COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN cargo build --release

FROM alpine:latest
RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/target/release/medalzai .

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000
CMD ["./medalzai"]
