package server

import (
	"net/http"

	"github.com/Mitskiyu/medal/internal/video"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func New(ao, port string) *http.Server {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{ao},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	r.Get("/api/video/proxy", video.Proxy)
	r.Post("/api/video", video.Handler)

	s := http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	return &s
}
