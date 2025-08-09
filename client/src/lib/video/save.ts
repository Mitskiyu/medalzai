import { PUBLIC_API_URL } from "$env/static/public";
import { zipSync } from "fflate";
import type { Video } from "$lib/types/video.ts";

export async function saveVideo(url: string, filename: string): Promise<void> {
	try {
		const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(url)}`;
		const res = await fetch(proxy);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}: ${res.status}`);
		}

		const blob = await res.blob();

		const downloadURL = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadURL;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(downloadURL);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function saveZIP(videos: Video[]): Promise<void> {
	if (videos.length === 0) return;

	try {
		const files: Record<string, Uint8Array> = {};

		const downloads = videos.map(
			async (
				video: Video,
			): Promise<{ video: Video; buffer: Uint8Array; filename: string } | null> => {
				try {
					const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(video.url)}`;
					const res = await fetch(proxy);

					if (!res.ok) {
						console.error(`Could not fetch ${video.url}: ${res.status}`);
						return null;
					}

					const buffer = await res.arrayBuffer();
					return {
						video,
						buffer: new Uint8Array(buffer),
						filename: formatFilename(video.game, video.date, video.username, video.title) + ".mp4",
					};
				} catch (error) {
					console.error(error);
					return null;
				}
			},
		);

		const results = await Promise.all(downloads);

		for (const result of results) {
			if (result) {
				files[result.filename] = result.buffer;
			}
		}

		const zipped = zipSync(files, { level: 0 });

		const blob = new Blob([zipped], { type: "application/zip" });
		const downloadURL = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadURL;
		a.download = `medal_videos_${new Date().toISOString().slice(0, 10)}.zip`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(downloadURL);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function formatFilename(game: string, date: string, name: string, title: string): string {
	const dateObj = new Date(date);
	const yymmdd =
		dateObj.getFullYear().toString().slice(-2) +
		(dateObj.getMonth() + 1).toString().padStart(2, "0") +
		dateObj.getDate().toString().padStart(2, "0");

	const formattedTitle = title.replace(/\s+/g, "-");

	const base = `${game.toUpperCase()}_${yymmdd}_${name}_`;
	const maxLength = 200 - base.length;

	return (
		base + (formattedTitle.length > maxLength ? formattedTitle.slice(0, maxLength) : formattedTitle)
	);
}
