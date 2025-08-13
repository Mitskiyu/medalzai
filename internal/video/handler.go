package video

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	var req Request

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	for _, url := range req.URLs {
		if !validate(url) {
			http.Error(w, "Invalid URL: "+url, http.StatusBadRequest)
			return
		}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()

	client := &http.Client{
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        20,
			MaxIdleConnsPerHost: 10,
			IdleConnTimeout:     60 * time.Second,
			DisableCompression:  false,
		},
	}

	results := make([]Response, len(req.URLs))
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 10)

	for i, url := range req.URLs {
		wg.Add(1)
		go func(index int, videoURL string) {
			defer wg.Done()

			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			result, err := processVideo(ctx, client, url)
			if err != nil {
				fmt.Printf("Error processing %s: %v\n", videoURL, err)
				return
			}

			results[index] = result
		}(i, url)
	}
	wg.Wait()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func Proxy(w http.ResponseWriter, r *http.Request) {
	videoURL := r.URL.Query().Get("url")
	if videoURL == "" {
		http.Error(w, "Invalid parameter", http.StatusBadRequest)
		return
	}

	client := &http.Client{
		Timeout: 60 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 20,
			IdleConnTimeout:     90 * time.Second,
			DisableCompression:  true,
			WriteBufferSize:     64 * 1024,
			ReadBufferSize:      64 * 1024,
		},
	}

	req, err := http.NewRequest("GET", videoURL, nil)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	req.Header.Set("User-Agent", r.Header.Get("User-Agent"))

	res, err := client.Do(req)
	if err != nil {
		http.Error(w, "Could not fetch video", http.StatusInternalServerError)
		return
	}
	defer res.Body.Close()

	for key, values := range res.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(res.StatusCode)

	_, err = io.CopyBuffer(w, res.Body, make([]byte, 32*1024))
	if err != nil {
		fmt.Printf("Error streaming video: %v\n", err)
	}
}
