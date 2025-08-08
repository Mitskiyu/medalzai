package video

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
)

func processVideo(ctx context.Context, client *http.Client, url string) (Response, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return Response{}, err
	}

	res, err := client.Do(req)
	if err != nil {
		return Response{}, err
	}
	defer res.Body.Close()

	body := io.LimitReader(res.Body, 5*1024*1024)

	b, err := io.ReadAll(body)
	if err != nil {
		return Response{}, err
	}

	html := string(b)
	hd := extract(html)
	data := parse(hd)

	return data, nil
}

func parse(hydrationData string) Response {
	var hd HydrationData

	err := json.Unmarshal([]byte(hydrationData), &hd)
	if err != nil {
		return Response{}
	}

	for _, cd := range hd.Clips {
		date := time.UnixMilli(cd.Created).Format(time.RFC3339)

		return Response{
			Title:     cd.ContentTitle,
			Game:      cd.Category.CategoryName,
			Username:  cd.Poster.DisplayName,
			URL:       cd.ContentUrl,
			Thumbnail: cd.ThumbnailUrl,
			Date:      date,
		}
	}

	return Response{}
}

func extract(html string) string {
	start := strings.Index(html, "var hydrationData=")
	if start == -1 {
		return ""
	}

	start += len("var hydrationData=")

	for start < len(html) && html[start] != '{' {
		start++
	}

	if start >= len(html) {
		return ""
	}

	depth := 0
	end := start
	for end < len(html) {
		switch html[end] {
		case '{':
			depth++
		case '}':
			depth--
			if depth == 0 {
				return html[start : end+1]
			}
		}
		end++
	}

	return ""
}

func validate(url string) bool {
	if len(url) == 0 {
		return false
	}

	if !strings.HasPrefix(url, "https://medal.tv/") {
		return false
	}

	return true
}
