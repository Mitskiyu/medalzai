import { zipSync } from "fflate";
import type { Video } from "$lib/types/video.ts";

export async function saveVideo(url: string, filename: string): Promise<void> {
	try {
		const res = await fetch(url);

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

		for (const video of videos) {
			const res = await fetch(video.url);

			if (!res.ok) {
				console.error(`Failed to fetch ${video.title}: ${res.status}`);
				continue;
			}

			const buffer = await res.arrayBuffer();
			const filename = formatFilename(video.game, video.date, video.username, video.title);
			const extension = ".mp4";

			files[filename + extension] = new Uint8Array(buffer);
		}

		const zipped = zipSync(files, { level: 1 });

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
