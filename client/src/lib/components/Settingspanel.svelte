<script lang="ts">
	import { HardDriveDownload, Check, X } from "@lucide/svelte";
	import { settingsState } from "$lib/state/index.svelte";

	const setAllowDuplicates = (value: boolean) => {
		settingsState.allowDuplicates = value;
	};
</script>

<div class="bg-medal-black outline-medal-lgray font-main h-auto rounded-2xl p-4 text-white">
	<div class="flex flex-row items-center space-x-3">
		<div class="bg-medal-lime flex h-10 w-10 items-center justify-center rounded-full">
			<HardDriveDownload size="28" color="black" />
		</div>
		<h3 class="text-2xl font-semibold">Saving</h3>
	</div>
	<div class="mt-1 flex flex-col gap-4">
		<div class="flex flex-col gap-1 pt-3">
			<h5 class="font-semibold">Duplicate Downloads</h5>
			<p class="text-sm text-white/60">
				Automatically filter duplicate links, to prevent downloading the same video twice
			</p>
		</div>
		<div class="flex w-full gap-3">
			<button
				onclick={() => setAllowDuplicates(true)}
				class="{settingsState.allowDuplicates ? 'bg-medal-orange' : 'bg-medal-lgray text-white'} 
               flex flex-1 flex-row items-center justify-center gap-2 rounded-lg p-4 text-black transition-all
               duration-200 hover:scale-105 hover:cursor-pointer active:scale-95"
			>
				<Check size="22" strokeWidth="3" />
				<span>Enable</span>
			</button>
			<button
				onclick={() => setAllowDuplicates(false)}
				class="{!settingsState.allowDuplicates ? 'bg-medal-orange' : 'bg-medal-lgray text-white'} 
               flex flex-1 flex-row items-center justify-center gap-2 rounded-lg p-4 text-black transition-all
               duration-200 hover:scale-105 hover:cursor-pointer active:scale-95"
			>
				<X size="22" strokeWidth="3" />
				<span>Disable</span>
			</button>
		</div>
	</div>
	<div class="mt-1 flex flex-col gap-4">
		<div class="flex flex-col gap-2 pt-3">
			<h5 class="font-semibold">Customize Filename Format</h5>
			<p class="text-sm text-white/60">
				Customize how your downloaded video files are named using these templates:
			</p>
			<ul class="list-inside list-disc text-sm text-white/60">
				<li><code>%game%</code> – game name</li>
				<li><code>%date%</code> – clip upload date in <span class="italic">YYMMDD</span> format</li>
				<li><code>%name%</code> – uploader's Medal username</li>
				<li><code>%title%</code> – clip title</li>
			</ul>
			<div class="relative">
				<input
					type="text"
					bind:value={settingsState.filenameFormat}
					placeholder="%game%_%date%_%name%_%title%"
					class="font-main bg-medal-lgray focus:ring-medal-orange w-full rounded-xl p-2 pr-16
	         text-base transition duration-200
	         placeholder:italic focus:ring-2 focus:outline-none"
				/>
				<div
					class="bg-medal-orange absolute top-1/2 right-2 -translate-y-1/2 transform rounded px-2 py-1 text-sm text-black"
				>
					.mp4
				</div>
			</div>
			<p class="text-sm text-white/60">Filenames are limited to 200 characters total</p>
		</div>
	</div>
</div>
