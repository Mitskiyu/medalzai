import { PUBLIC_API_URL } from "$env/static/public";

interface VideoResponse {
	username: string;
	title: string;
	game: string;
	date: string;
	url: string;
	thumbnail: string;
}

export async function fetchVideos(urls: string[]): Promise<VideoResponse[]> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/video`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ urls }),
		});

		if (!res.ok) {
			throw new Error(`Request failed with status ${res.status}`);
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error("Error fetching videos:", error);
		throw error;
	}
}
