package video

type Request struct {
	URLs []string `json:"urls"`
}

type Response struct {
	Username  string `json:"username"`
	Title     string `json:"title"`
	Game      string `json:"game"`
	Date      string `json:"date"`
	URL       string `json:"url"`
	Thumbnail string `json:"thumbnail"`
}

type HydrationData struct {
	Clips map[string]struct {
		Poster struct {
			DisplayName string
		}

		Category struct {
			CategoryName string
		}

		ContentTitle string
		Created      int64
		ContentUrl   string
		ThumbnailUrl string
	}
}
