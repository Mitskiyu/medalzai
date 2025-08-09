<script lang="ts">
	import type { Video } from "$lib/types/video.ts";
	import { fetchVideos, validate } from "$lib/video";
	import { Linkarea, Videopanel, Toolbar } from "$lib/components";

	let inputText = $state<string>("");
	let areaFocused = $state<boolean>(false);
	let videos = $state<Video[]>([]);

	function clearAll() {
		videos = [];
		inputText = "";
		areaFocused = false;
	}

	async function refreshAll() {
		if (!inputText.trim()) return;

		const urls = inputText.split("\n").filter((url) => url.trim());
		const valid = validate(urls);
		if (!valid) return;

		videos = [];
		try {
			const videoData = await fetchVideos(urls);
			videos = videoData;
		} catch (error) {
			console.error("Failed to refresh videos:", error);
		}
	}

	$effect(() => {
		if (!areaFocused && inputText.trim()) {
			const urls = inputText.split("\n");
			const valid = validate(urls);
			if (!valid) return;

			fetchVideos(urls)
				.then((videoData) => {
					videos = videoData;
				})
				.catch((error) => {
					console.error("Failed to fetch videos:", error);
				});
		}
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
