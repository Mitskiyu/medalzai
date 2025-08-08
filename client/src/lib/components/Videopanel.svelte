<script lang="ts">
	import type { Video } from "$lib/types/video";
	import { formatFilename, saveVideo } from "$lib/video";
	import { HardDriveDownload } from "@lucide/svelte";
	let { video }: { video: Video } = $props<{ video: Video }>();

	function handleDownload() {
		const filename = formatFilename(video.game, video.date, video.username, video.title);
		saveVideo(video.url, filename);
	}
</script>

<div class="bg-medal-black outline-medal-lgray font-main h-60 rounded-2xl p-4 text-white outline-2">
	<div class="flex h-full flex-col gap-3">
		<img
			src={video.thumbnail}
			alt={video.title}
			class="h-32 w-full flex-shrink-0 rounded-lg object-cover"
		/>
		<div class="flex flex-1 flex-col truncate">
			<h3 class="line-clamp-2 text-base leading-tight font-bold text-white">{video.title}</h3>
			<div class="mt-2 flex h-8 items-start justify-between">
				<div class="gap-y-0.1 flex min-w-0 flex-1 flex-col text-sm text-white/70">
					<h2>{video.username}</h2>
					<h2>{video.game}</h2>
				</div>
				<button
					class="bg-medal-lime text-medal-black ml-3 flex h-10 items-center gap-2 rounded-3xl p-2 text-sm font-bold transition-colors hover:cursor-pointer hover:opacity-80"
					onclick={handleDownload}
				>
					<HardDriveDownload size="24" />
				</button>
			</div>
		</div>
	</div>
</div>
