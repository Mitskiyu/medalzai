package server

import (
	"net/http"

	"github.com/Mitskiyu/medal/internal/video"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func New(port string) *http.Server {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Medal"))
	})
	r.Post("/api/video", video.Handler)

	s := http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	return &s
}
