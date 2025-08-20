<script lang="ts">
	import { toast } from "svelte-sonner";
	import type { Video } from "$lib/types/video";
	import { appState, settingsState } from "$lib/state/index.svelte";
	import { fetchVideos } from "$lib/video";
	import { Linkarea, Videopanel, Toolbar } from "$lib/components";

	let isLoading = $state<boolean>(false);
	let areaFocused = $state<boolean>(false);
	let processedUrls = $state<Set<string>>(new Set());
	let processedCount = $state<number>(0);

	$effect(() => {
		if (appState.urls.length > 0 && appState.videos.length === 0 && !isLoading) {
			handleFetch();
		}
	});

	function handleAreaChange() {
		if (!areaFocused && !isLoading) {
			handleFetch();
		}
	}

	function handleInvalidUrl(url: string) {
		toast.error(`Automatically removed invalid Medal link: ${url}`);
	}

	function handleDuplicatesRemoved(count: number, duplicates: string[]) {
		toast.info(
			`Automatically filtered ${count} duplicate link${count > 1 ? "s" : ""} - toggle in Settings to disable`,
		);
		duplicates.forEach((url) => {
			console.log(`Duplicate removed: ${url}`);
		});
	}

	async function handleFetch(refresh: boolean = false) {
		if (appState.urls.length === 0 || isLoading) return;

		const newUrls = refresh
			? appState.urls
			: settingsState.allowDuplicates
				? appState.urls.slice(processedCount)
				: appState.urls.filter((url) => !processedUrls.has(url));

		if (newUrls.length === 0) return;

		isLoading = true;
		if (refresh) {
			appState.videos = [];
			processedUrls.clear();
			processedCount = 0;
		}

		try {
			const data = await fetchVideos(newUrls);
			data.forEach((video, i) => {
				const currentUrl = newUrls[i];
				if (!video.url) {
					toast.error(
						`Could not find video, make sure link is valid and clip is public: ${currentUrl}`,
					);
				} else {
					const appVideo: Video = {
						id: crypto.randomUUID(),
						...video,
					};
					appState.videos.push(appVideo);
					processedUrls.add(currentUrl);
				}
			});

			if (settingsState.allowDuplicates) {
				processedCount = appState.urls.length;
			}
		} catch (error) {
			toast.error("Something went wrong, try again later");
			console.error("Failed to fetch videos: ", error);
		} finally {
			isLoading = false;
		}
	}

	async function refreshAll() {
		await handleFetch(true);
	}

	function clearAll() {
		appState.videos = [];
		appState.urls = [];
		isLoading = false;
		processedUrls.clear();
		processedCount = 0;
	}
</script>

<div class="mt-8">
	<div class="-mt-6 mb-6">
		<Toolbar videos={appState.videos} {clearAll} {refreshAll} />
	</div>
	<div class="mb-4">
		<Linkarea
			bind:inputText={appState.inputText}
			bind:areaFocused
			onAreaChange={handleAreaChange}
			onInvalidUrl={handleInvalidUrl}
			onDuplicatesRemoved={handleDuplicatesRemoved}
		/>
	</div>
	<div class="grid grid-cols-2 gap-4">
		{#each appState.videos as video (video.id)}
			<div>
				<Videopanel {video} />
			</div>
		{/each}
	</div>
</div>
