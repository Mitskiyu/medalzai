<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import { toast } from "svelte-sonner";
	import { appState } from "$lib/state/index.svelte";
	import { fetchVideos, validate } from "$lib/video";
	import { Linkarea, Videopanel, Toolbar } from "$lib/components";

	let isLoading = $state<boolean>(false);
	let urlStatus = $state<Record<string, "processing" | "done" | "failed">>({});

	$effect(() => {
		if (!appState.areaFocused && appState.inputText.trim() && !isLoading) {
			handleFetch();
		}
	});

	async function handleFetch(refresh: boolean = false) {
		if (!appState.inputText.trim() || isLoading) return;

		const seen = new SvelteSet();
		const urls = appState.inputText
			.split("\n")
			.filter((url) => url.trim())
			.filter((url) => {
				const base = url.split("?")[0];
				if (seen.has(base)) {
					console.log(`Removed duplicate link: ${url}`);
					return false;
				}
				seen.add(base);
				return true;
			});

		const valid = validate(urls);
		if (!valid) {
			isLoading = false;
			return;
		}

		const newUrls = refresh ? urls : urls.filter((url) => !urlStatus[url.trim()]);
		if (newUrls.length === 0) {
			isLoading = false;
			return;
		}

		isLoading = true;
		if (refresh) {
			appState.videos = [];
			urlStatus = {};
		}

		try {
			newUrls.forEach((url) => {
				urlStatus[url.trim()] = "processing";
			});

			const data = await fetchVideos(newUrls);
			data.forEach((video, i) => {
				const currentUrl = newUrls[i].trim();
				if (!video.url) {
					setTimeout(() => {
						toast.error(
							`Could not find video, make sure URL is valid and clip is public: ${currentUrl}`,
						);
					}, 50);
					console.log(`Could not fetch video for: ${currentUrl}`);
					urlStatus[currentUrl] = "failed";
				} else {
					if (!appState.videos.some((existingVideo) => existingVideo.url === video.url)) {
						appState.videos.push(video);
					}
					urlStatus[currentUrl] = "done";
				}
			});
		} catch (error) {
			toast.error("Something went wrong, try again later");
			console.error("Failed to fetch videos: ", error);
			newUrls.forEach((url) => {
				urlStatus[url.trim()] = "failed";
			});
		} finally {
			isLoading = false;
		}
	}

	async function refreshAll() {
		await handleFetch(true);
	}

	function clearAll() {
		appState.videos = [];
		appState.inputText = "";
		appState.areaFocused = false;
		isLoading = false;
		urlStatus = {};
	}
</script>

<div class="mt-8">
	<div class="-mt-6 mb-6">
		<Toolbar videos={appState.videos} {clearAll} {refreshAll} />
	</div>
	<div class="mb-4">
		<Linkarea bind:inputText={appState.inputText} bind:areaFocused={appState.areaFocused} />
	</div>
	<div class="grid grid-cols-2 gap-4">
		{#each appState.videos as video, i (video.url + i)}
			<div>
				<Videopanel {video} />
			</div>
		{/each}
	</div>
</div>
