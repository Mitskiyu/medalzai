package video

import (
	"encoding/json"
	"io"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	var req Request

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	var results []Response

	for _, url := range req.URLs {
		valid := validate(url)
		if !valid {
			http.Error(w, "Invalid URL: "+url, http.StatusBadRequest)
			return
		}

		res, err := http.Get(url)
		if err != nil {
			http.Error(w, "Could not fetch video: "+url, http.StatusBadGateway)
			return
		}
		defer res.Body.Close()

		b, err := io.ReadAll(res.Body)
		if err != nil {
			http.Error(w, "Could not fetch video: "+url, http.StatusBadGateway)
			return
		}

		html := string(b)
		hd := extract(html)
		data := parse(hd)
		results = append(results, data)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
