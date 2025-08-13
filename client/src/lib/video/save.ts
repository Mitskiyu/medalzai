import { PUBLIC_API_URL } from "$env/static/public";
import { zipSync } from "fflate";
import type { Video } from "$lib/types/video.ts";

export async function saveVideo(url: string, filename: string): Promise<void> {
	const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(url)}`;
	const res = await fetch(proxy);

	if (!res.ok) {
		throw new Error(`Could not fetch ${url}: ${res.status}`);
	}

	const blob = await res.blob();
	downloadBlob(blob, filename);
}

export async function saveZIP(
	videos: Video[],
	onProgress: (current: number, total: number) => void,
): Promise<void> {
	if (videos.length === 0) return;

	const files: Record<string, Uint8Array> = {};
	const total = videos.length + 1;
	let done = 0;

	const downloads = videos.map(
		async (video: Video): Promise<{ buffer: Uint8Array; filename: string } | null> => {
			try {
				const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(video.url)}`;
				const res = await fetch(proxy);

				if (!res.ok) {
					done++;
					onProgress(done, total);
					console.error(`Could not fetch ${video.url}: ${res.status}`);
					return null;
				}

				const buffer = await res.arrayBuffer();
				done++;
				onProgress(done, total);
				return {
					buffer: new Uint8Array(buffer),
					filename: formatFilename(video.game, video.date, video.username, video.title) + ".mp4",
				};
			} catch (error) {
				done++;
				onProgress(done, total);
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
	done++;
	onProgress(done, total);

	const blob = new Blob([zipped], { type: "application/zip" });
	const filename = `Medal_Videos_${videos.length}.zip`;
	downloadBlob(blob, filename);
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

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
