<script lang="ts">
	import { FileArchive, LoaderCircle, Trash2, RefreshCcw } from "@lucide/svelte";
	import type { Video } from "$lib/types/video.ts";
	import { saveZIP } from "$lib/video";

	let { videos = [] }: { videos: Video[] } = $props();
	let isSaving = $state(false);

	async function handleSave() {
		if (videos.length === 0) return;

		try {
			isSaving = true;
			await saveZIP(videos);
		} catch (error) {
			console.error(error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div
	class="bg-medal-gray font-main drop-shadow-medal-lime flex h-22 w-full items-center justify-between rounded-2xl px-4 py-2 drop-shadow-md"
>
	<button
		class="bg-medal-black hover:text-medal-lime outline-medal-lgray flex h-16 w-46 items-center justify-center gap-1.5 rounded-4xl px-4 py-1.5 text-base font-bold text-white outline-2 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
		onclick={handleSave}
		disabled={isSaving}
	>
		{#if isSaving}
			<LoaderCircle size="24" class="text-medal-lime animate-spin" />
		{:else}
			<FileArchive size="24" />
			Save all as <span class="text-medal-lime">.zip</span>
		{/if}
	</button>
	<div class="flex">
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 ml-3 flex h-12 items-center gap-1.5 rounded-4xl px-3 py-1.5 text-base font-bold transition-colors hover:cursor-pointer"
		>
			<Trash2 size="24" />
		</button>
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 ml-3 flex h-12 items-center gap-1.5 rounded-4xl px-3 py-1.5 text-base font-bold transition-colors hover:cursor-pointer"
		>
			<RefreshCcw size="24" />
		</button>
	</div>
</div>
