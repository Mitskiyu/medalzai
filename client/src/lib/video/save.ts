import { PUBLIC_API_URL } from "$env/static/public";
import { zipSync } from "fflate";
import type { Video } from "$lib/types/video.ts";
import { appState, settingsState } from "$lib/state/index.svelte";

export async function saveVideo(url: string, filename: string): Promise<void> {
	const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(url)}`;
	const res = await fetch(proxy);

	if (!res.ok) {
		throw new Error(`Could not fetch ${url}: ${res.status}`);
	}

	const blob = await res.blob();
	downloadBlob(blob, filename);
}

export async function saveZIP(videos: Video[]): Promise<void> {
	if (videos.length === 0) return;

	appState.zipProgress = {
		isActive: true,
		current: 0,
		total: videos.length + 1,
	};

	const filename = `Medal_Videos_${videos.length}.zip`;
	const files: Record<string, Uint8Array> = {};
	const used = new Set<string>();

	const downloads = videos.map(
		async (video: Video): Promise<{ buffer: Uint8Array; filename: string } | null> => {
			try {
				const proxy = `${PUBLIC_API_URL}/api/video/proxy?url=${encodeURIComponent(video.url)}`;
				const res = await fetch(proxy);

				if (!res.ok) {
					appState.zipProgress.current++;
					console.error(`Could not fetch ${video.url}: ${res.status}`);
					return null;
				}

				const buffer = await res.arrayBuffer();
				appState.zipProgress.current++;

				let filename = formatFilename(video.game, video.date, video.username, video.title);
				let count = 1;

				while (used.has(filename)) {
					filename =
						formatFilename(video.game, video.date, video.username, video.title) + `_${count}`;
					count++;
				}

				used.add(filename);

				return {
					buffer: new Uint8Array(buffer),
					filename: filename + ".mp4",
				};
			} catch (error) {
				appState.zipProgress.current++;
				console.error(error);
				return null;
			}
		},
	);

	try {
		const results = await Promise.all(downloads);

		for (const result of results) {
			if (result) {
				files[result.filename] = result.buffer;
			}
		}

		const zipped = zipSync(files, { level: 0 });
		appState.zipProgress.current++;

		const blob = new Blob([zipped], { type: "application/zip" });
		downloadBlob(blob, filename);
	} catch (error) {
		console.error("ZIP creation failed:", error);
	} finally {
		appState.zipProgress = {
			isActive: false,
			current: 0,
			total: 0,
		};
	}
}

export function formatFilename(game: string, date: string, name: string, title: string): string {
	const dateObj = new Date(date);
	const yymmdd =
		dateObj.getFullYear().toString().slice(-2) +
		(dateObj.getMonth() + 1).toString().padStart(2, "0") +
		dateObj.getDate().toString().padStart(2, "0");

	const cleanGame = game.toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
	const cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
	const cleanTitle = title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");

	const format = settingsState.filenameFormat.trim() || "%game%_%date%_%name%_%title%";

	let filename = format
		.replace(/%game%/g, cleanGame)
		.replace(/%date%/g, yymmdd)
		.replace(/%name%/g, cleanName)
		.replace(/%title%/g, cleanTitle);

	if (filename.length > 196) {
		filename = filename.slice(0, 196);
	}

	return filename;
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
