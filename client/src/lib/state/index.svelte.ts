import type { Video } from "$lib/types/video";

interface AppState {
	inputText: string;
	validUrls: string[];
	fetchedUrls: string[];
	videos: Video[];
	goingLeft: boolean;
	previousPath: string;
	zipProgress: {
		isActive: boolean;
		current: number;
		total: number;
	};
}

interface SettingsState {
	allowDuplicates: boolean;
	filenameFormat: string;
}

export const appState = $state<AppState>({
	inputText: "",
	validUrls: [],
	fetchedUrls: [],
	videos: [],
	goingLeft: false,
	previousPath: "",
	zipProgress: {
		isActive: false,
		current: 0,
		total: 0,
	},
});

export const settingsState = $state<SettingsState>({
	allowDuplicates: false,
	filenameFormat: "%game%_%date%_%name%_%title%",
});
