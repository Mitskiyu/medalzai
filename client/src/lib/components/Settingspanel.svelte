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
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-1 pt-3">
			<h5 class="font-semibold">Duplicate downloads</h5>
			<p class="text-sm text-white/60">Allow or prevent duplicate file downloads</p>
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
</div>
