import type { Video } from "$lib/types/video";

interface AppState {
	redirected: boolean;
	videos: Video[];
	inputText: string;
}

export const appState = $state<AppState>({
	redirected: false,
	videos: [],
	inputText: "",
});
