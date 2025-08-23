<script lang="ts">
	import { HardDriveDownload, LoaderCircle, X } from "@lucide/svelte";
	import type { Video } from "$lib/types/video";
	import { formatFilename, saveVideo } from "$lib/video";

	let { video, onRemove = null } = $props<{
		video: Video;
		onRemove?: (() => void) | null;
	}>();

	let isSaving = $state(false);

	function handleRemove() {
		onRemove?.();
	}

	async function handleSave() {
		if (!video) return;
		try {
			isSaving = true;
			const filename = formatFilename(video.game, video.date, video.username, video.title);
			await saveVideo(video.url, filename);
		} catch (error) {
			console.error(error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div
	class="bg-medal-black outline-medal-lgray font-main h-32 rounded-2xl p-2 text-white outline-2 sm:h-60 sm:p-4"
>
	<div class="relative flex h-full flex-col">
		<div class="relative flex-1 sm:hidden">
			<img src={video.thumbnail} alt={video.title} class="h-full w-full rounded-lg object-cover" />

			<button
				class="bg-medal-black hover:bg-medal-gray absolute -top-1 -right-1 z-10 rounded-full p-1 hover:cursor-pointer"
				onclick={handleRemove}
			>
				<X class="size-3" />
			</button>

			<div
				class="absolute inset-x-0 top-0 rounded-t-lg bg-gradient-to-b from-black/60 via-black/30 to-transparent p-2"
			>
				<h3 class="line-clamp-2 max-w-[80%] text-xs leading-tight font-bold text-white">
					{video.title}
				</h3>
			</div>

			<div
				class="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-black/60 to-transparent p-2 pt-6"
			>
				<div class="mb-4.5 flex min-w-0 flex-1 flex-col gap-y-0.25 text-[0.5rem] text-white/80">
					<h2>{video.username}</h2>
					<h2>{video.game}</h2>
				</div>
			</div>

			<div class="absolute inset-x-0 bottom-0 px-2">
				<button
					class="bg-medal-lime text-medal-black flex w-full items-center justify-center gap-2 rounded-lg py-1 text-xs font-bold transition-colors hover:cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
					onclick={handleSave}
					disabled={isSaving}
				>
					{#if isSaving}
						<span>Saving...</span>
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						<span>Save</span>
						<HardDriveDownload class="size-4" />
					{/if}
				</button>
			</div>
		</div>

		<div class="hidden sm:flex sm:h-full sm:flex-col sm:gap-3">
			<div class="relative">
				<img
					src={video.thumbnail}
					alt={video.title}
					class="h-32 w-full flex-shrink-0 rounded-lg object-cover"
				/>
				<button
					class="bg-medal-black hover:bg-medal-gray absolute -top-3 -right-3 rounded-full p-1 hover:cursor-pointer"
					onclick={handleRemove}
				>
					<X class="size-4" />
				</button>
			</div>

			<div class="flex flex-1 flex-col truncate">
				<h3 class="line-clamp-2 text-base leading-tight font-bold text-white">{video.title}</h3>
				<div class="mt-2 flex h-8 items-start justify-between">
					<div class="flex min-w-0 flex-1 flex-col gap-y-0.5 text-sm text-white/70">
						<h2>{video.username}</h2>
						<h2>{video.game}</h2>
					</div>
					<button
						class="bg-medal-lime text-medal-black ml-3 flex size-10 items-center justify-center gap-2 rounded-3xl p-2 text-sm font-bold transition-colors hover:cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
						onclick={handleSave}
						disabled={isSaving}
					>
						{#if isSaving}
							<LoaderCircle class="size-5 animate-spin" />
						{:else}
							<HardDriveDownload class="size-5" />
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
