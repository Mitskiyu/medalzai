package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Mitskiyu/medal/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	ctx := context.Background()
	err := run(ctx, os.Getenv)
	if err != nil {
		log.Printf("error: %s\n", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, getenv func(string) string) error {
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("could not load env file: %w", err)
	}

	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	port := getenv("PORT")
	if port == "" {
		port = "3000"
	}

	s := server.New(port)

	go func() {
		fmt.Printf("Server starting on port %s\n", port)
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("Server error: %v", err)
			stop()
		}
	}()

	<-ctx.Done()
	log.Println("Shutdown signal received")

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := s.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("server forced to shutdown: %w", err)
	}

	return nil
}
