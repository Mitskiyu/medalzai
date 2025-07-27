package video

import (
	"encoding/json"
	"strings"
	"time"
)

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
