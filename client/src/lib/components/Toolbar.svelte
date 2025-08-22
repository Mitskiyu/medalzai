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
	class="bg-medal-gray font-main drop-shadow-medal-lime flex h-22 w-full items-center justify-between rounded-2xl px-4 py-2 drop-shadow-md"
>
	<button
		class="bg-medal-black hover:text-medal-lime outline-medal-lgray flex h-16 w-46 items-center justify-center gap-1.5 rounded-4xl px-4 py-1.5 text-base font-bold text-white outline-2 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:cursor-pointer disabled:cursor-not-allowed"
		onclick={handleSave}
		disabled={isRefreshing || appState.zipProgress.isActive}
	>
		{#if appState.zipProgress.isActive}
			<div class="flex w-full flex-col items-center gap-1">
				<span class="text-sm text-white">
					{Math.min(appState.zipProgress.current, videos.length)}/{videos.length}
				</span>
				<div class="bg-medal-gray relative h-1 w-full overflow-hidden rounded-full">
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
			<FileArchive size="24" />
			Save all as <span class="text-medal-lime">.zip</span>
		{/if}
	</button>
	<div class="flex">
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 ml-3 flex h-12 items-center gap-1.5 rounded-4xl px-3 py-1.5 text-base font-bold transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
			onclick={handleClear}
			disabled={isRefreshing || appState.zipProgress.isActive}
		>
			<Trash2 size="24" />
		</button>
		<button
			class="bg-medal-lime hover:bg-medal-lime/70 ml-3 flex h-12 items-center gap-1.5 rounded-4xl px-3 py-1.5 text-base font-bold transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
			onclick={handleRefresh}
			disabled={isRefreshing || appState.zipProgress.isActive}
		>
			{#if isRefreshing}
				<LoaderCircle size="24" class="animate-spin" />
			{:else}
				<RefreshCcw size="24" />
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
