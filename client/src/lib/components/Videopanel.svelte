<script lang="ts">
	import type { Video } from "$lib/types/video";
	import { HardDriveDownload } from "@lucide/svelte";
	let { video } = $props<{ video: Video }>();
</script>

<div class="bg-medal-black outline-medal-lgray font-main h-60 rounded-2xl p-4 text-white outline-2">
	<div class="flex h-full flex-col gap-3">
		<img
			src={video.thumbnail}
			alt={video.title}
			class="h-32 w-full flex-shrink-0 rounded-lg object-cover"
		/>
		<div class="flex min-h-0 flex-1 flex-col gap-2 truncate">
			<h3 class="line-clamp-2 text-sm leading-tight font-bold text-white">{video.title}</h3>
			<div class="mt-auto flex h-8 items-end justify-between">
				<div class="flex min-w-0 flex-1 flex-col gap-1 text-xs text-white/70">
					<h2>{video.username}</h2>
					<h2>{video.game}</h2>
				</div>
				<button
					class="bg-medal-lime hover:bg-medal-lime/70 ml-3 flex h-full flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-black transition-colors hover:cursor-pointer"
				>
					<HardDriveDownload size={14} />
					Save
				</button>
			</div>
		</div>
	</div>
</div>
