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

<div class="bg-medal-black outline-medal-lgray font-main h-60 rounded-2xl p-4 text-white outline-2">
	<div class="flex h-full flex-col gap-3">
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
				<X size="16" />
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
					class="bg-medal-lime text-medal-black ml-3 flex h-10 items-center gap-2 rounded-3xl p-2 text-sm font-bold transition-colors hover:cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
					onclick={handleSave}
					disabled={isSaving}
				>
					{#if isSaving}
						<LoaderCircle size="24" class="animate-spin" />
					{:else}
						<HardDriveDownload size="24" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>
