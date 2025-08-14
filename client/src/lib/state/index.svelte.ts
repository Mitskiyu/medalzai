import type { Video } from "$lib/types/video";

interface VideoState {
	videos: Video[];
	inputText: string;
}

export const videoState = $state<VideoState>({
	videos: [],
	inputText: "",
});
