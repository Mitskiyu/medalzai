<script lang="ts">
	import { HardDriveDownload, Check, X } from "@lucide/svelte";
	import { settingsState } from "$lib/state/index.svelte";
	const setAllowDuplicates = (value: boolean) => {
		settingsState.allowDuplicates = value;
	};
</script>

<div class="bg-medal-black font-main rounded-2xl p-4 text-white sm:p-6">
	<div class="flex flex-row items-center gap-3">
		<div
			class="bg-medal-lime flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12"
		>
			<HardDriveDownload class="size-6 sm:size-7" color="black" />
		</div>
		<h3 class="text-lg font-bold sm:text-2xl">Saving</h3>
	</div>

	<div class="mt-6 flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<h5 class="text-base font-bold sm:text-lg">Duplicate Downloads</h5>
			<p class="text-sm text-white/60 sm:text-base">
				Automatically filter duplicate links, to prevent downloading the same video twice
			</p>
		</div>

		<div class="flex w-full gap-3">
			<button
				onclick={() => setAllowDuplicates(false)}
				class="{!settingsState.allowDuplicates ? 'bg-medal-orange' : 'bg-medal-lgray text-white'} 
               flex flex-1 flex-row items-center justify-center gap-2 rounded-xl p-3 font-bold text-black transition-all
               duration-200 hover:scale-105 hover:cursor-pointer active:scale-95 sm:p-4"
			>
				<Check class="size-5 sm:size-6" strokeWidth="3" />
				<span class="text-sm sm:text-base">Enable</span>
			</button>
			<button
				onclick={() => setAllowDuplicates(true)}
				class="{settingsState.allowDuplicates ? 'bg-medal-orange' : 'bg-medal-lgray text-white'} 
               flex flex-1 flex-row items-center justify-center gap-2 rounded-xl p-3 font-bold text-black transition-all
               duration-200 hover:scale-105 hover:cursor-pointer active:scale-95 sm:p-4"
			>
				<X class="size-5 sm:size-6" strokeWidth="3" />
				<span class="text-sm sm:text-base">Disable</span>
			</button>
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<h5 class="text-base font-bold sm:text-lg">Customize Filename Format</h5>
			<p class="text-sm text-white/60 sm:text-base">
				Customize how your downloaded video files are named using these templates:
			</p>
			<ul class="list-inside list-disc text-sm text-white/60 sm:text-base">
				<li><code class="bg-medal-lgray rounded px-1">%game%</code> – game name</li>
				<li>
					<code class="bg-medal-lgray rounded px-1">%date%</code> – clip upload date in
					<span class="italic">YYMMDD</span> format
				</li>
				<li><code class="bg-medal-lgray rounded px-1">%name%</code> – uploader's Medal username</li>
				<li><code class="bg-medal-lgray rounded px-1">%title%</code> – clip title</li>
			</ul>
		</div>

		<div class="relative">
			<input
				type="text"
				bind:value={settingsState.filenameFormat}
				placeholder="%game%_%date%_%name%_%title%"
				class="font-main bg-medal-lgray focus:ring-medal-orange w-full rounded-xl p-3 pr-16
         text-sm text-white transition duration-200
         placeholder:text-white/60 placeholder:italic focus:ring-2 focus:outline-none sm:p-4 sm:text-base"
			/>
			<div
				class="bg-medal-orange absolute top-1/2 right-3 -translate-y-1/2 transform rounded-lg px-2 py-1 text-xs font-bold text-black sm:text-sm"
			>
				.mp4
			</div>
		</div>
		<p class="text-sm text-white/60">Filenames are limited to 200 characters total</p>
	</div>
</div>
