<script lang="ts">
	import { toast } from "svelte-sonner";
	import { FileArchive, LoaderCircle, Trash2, RefreshCcw } from "@lucide/svelte";
	import type { Video } from "$lib/types/video.ts";
	import { saveZIP } from "$lib/video";
	import { appState } from "$lib/state/index.svelte";

	let {
		videos = [],
		clearAll,
		refreshAll,
	}: {
		videos: Video[];
		clearAll: () => void;
		refreshAll: () => Promise<void>;
	} = $props();

	let isRefreshing = $state(false);

	const progressPercent = $derived(
		appState.zipProgress.total > 0
			? (appState.zipProgress.current / appState.zipProgress.total) * 100
			: null,
	);

	async function handleSave() {
		if (videos.length === 0) return;
		try {
			await saveZIP(videos);
		} catch (error) {
			toast.error("Could not create ZIP file, try again later");
			console.error(error);
		}
	}

	function handleClear() {
		clearAll();
	}

	async function handleRefresh() {
		isRefreshing = true;
		await refreshAll();
		isRefreshing = false;
	}
</script>

<div
	class="bg-medal-gray font-main drop-shadow-medal-lime flex h-18 w-full items-center justify-between rounded-2xl px-4 py-2 drop-shadow-md sm:h-22 sm:px-6"
>
	<button
		class="bg-medal-black hover:text-medal-lime outline-medal-lgray flex h-10 w-40 items-center justify-center gap-1.5 rounded-4xl py-4 text-sm font-bold text-white outline-2 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:cursor-pointer disabled:cursor-not-allowed sm:h-16 sm:w-46 sm:px-4 sm:text-base"
		onclick={handleSave}
		disabled={isRefreshing || appState.zipProgress.isActive}
	>
		{#if appState.zipProgress.isActive}
			<div class="flex w-full flex-col items-center gap-1">
				<span class="text-xs text-white sm:text-sm">
					{Math.min(appState.zipProgress.current, videos.length)}/{videos.length}
				</span>
				<div class="bg-medal-gray relative h-1 w-3/4 overflow-hidden rounded-full sm:w-full">
					<div
						class="bg-medal-orange absolute top-0 left-0 h-full"
						class:progress-animation={progressPercent === null}
						style={progressPercent
							? `width: ${progressPercent}%; transition: width 0.3s ease-out;`
							: ""}
					></div>
				</div>
			</div>
		{:else}
			<FileArchive class="size-5 sm:size-8" />
			<span>Save all as <span class="text-medal-lime">.zip</span></span>
		{/if}
	</button>
	<div class="flex gap-2 sm:gap-3">
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 flex size-10 items-center justify-center rounded-4xl text-base font-bold transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12"
			onclick={handleClear}
			disabled={isRefreshing || appState.zipProgress.isActive}
		>
			<Trash2 class="size-5 sm:size-8" />
		</button>
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 flex size-10 items-center justify-center rounded-4xl text-base font-bold transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12"
			onclick={handleRefresh}
			disabled={isRefreshing || appState.zipProgress.isActive}
		>
			{#if isRefreshing}
				<LoaderCircle class="size-5 animate-spin sm:size-8" />
			{:else}
				<RefreshCcw class="size-5 sm:size-8" />
			{/if}
		</button>
	</div>
</div>

<style>
	.progress-animation {
		animation: flowing-bar 1.2s ease-in-out infinite;
	}

	@keyframes flowing-bar {
		0% {
			width: 0%;
			left: 0;
		}
		40% {
			width: 100%;
			left: 0;
		}
		100% {
			width: 0%;
			left: 100%;
		}
	}
</style>
