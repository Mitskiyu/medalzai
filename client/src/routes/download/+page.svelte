<script lang="ts">
	import { toast } from "svelte-sonner";
	import type { Video } from "$lib/types/video.ts";
	import { fetchVideos, validate } from "$lib/video";
	import { Linkarea, Videopanel, Toolbar } from "$lib/components";

	let inputText = $state<string>("");
	let areaFocused = $state<boolean>(false);
	let videos = $state<Video[]>([]);
	let urlStatus = $state<Record<string, "processing" | "done" | "failed">>({});

	function clearAll() {
		videos = [];
		inputText = "";
		areaFocused = false;
	}

	async function handleFetch(clear: boolean = false) {
		if (!inputText.trim()) return;

		const urls = inputText.split("\n").filter((url) => url.trim());
		const valid = validate(urls);
		if (!valid) return;

		const newUrls = clear ? urls : urls.filter((url) => !urlStatus[url.trim()]);
		if (newUrls.length === 0) return;

		if (clear) {
			videos = [];
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
					videos.push(video);
					urlStatus[currentUrl] = "done";
				}
			});
		} catch (error) {
			toast.error("Something went wrong, try again later");
			console.error("Failed to fetch videos: ", error);
			newUrls.forEach((url) => {
				urlStatus[url.trim()] = "failed";
			});
		}
	}

	async function refreshAll() {
		await handleFetch(true);
	}

	$effect(() => {
		if (!areaFocused && inputText.trim()) handleFetch();
	});
</script>

<div class="mt-8">
	<div class="-mt-6 mb-6">
		<Toolbar {videos} {clearAll} {refreshAll} />
	</div>
	{#if videos.length < 1}
		<Linkarea bind:inputText bind:areaFocused />
	{:else}
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Videopanel video={videos[0]} />
			</div>
			<div>
				<Linkarea bind:inputText bind:areaFocused />
			</div>
			{#if videos.length > 1}
				{#each videos.slice(1) as video, i (videos[i])}
					<div>
						<Videopanel {video} />
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
