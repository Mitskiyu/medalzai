import type { Video } from "$lib/types/video";

interface AppState {
	inputText: string;
	urls: string[];
	videos: Video[];
	goingLeft: boolean;
	previousPath: string;
}

interface SettingsState {
	allowDuplicates: boolean;
}

export const appState = $state<AppState>({
	inputText: "",
	urls: [],
	videos: [],
	goingLeft: false,
	previousPath: "",
});

export const settingsState = $state<SettingsState>({
	allowDuplicates: false,
});
