import type { Video } from "$lib/types/video";

interface AppState {
	videos: Video[];
	inputText: string;
	areaFocused: boolean;
	goingLeft: boolean;
	previousPath: string;
}

export const appState = $state<AppState>({
	videos: [],
	inputText: "",
	areaFocused: false,
	goingLeft: false,
	previousPath: "",
});
