<script lang="ts">
	import { appState } from "$lib/state/index.svelte";
	import { Linkarea } from "$lib/components";

	let areaFocused = $state<boolean>(false);
</script>

<div class="mt-8 flex flex-col items-center justify-center text-center font-bold text-white">
	<h1 class="text-2xl sm:text-4xl">
		Download <span class="text-medal-lime">Medal</span> clips
	</h1>
	<h2
		class="text-medal-lgray text-shadow-medal-gray -mt-1 text-lg text-shadow-lg sm:mt-0 sm:text-3xl"
	>
		Save in bulk, fast &amp; watermark-free
	</h2>
</div>
<div class="mt-8 w-full">
	<Linkarea bind:inputText={appState.inputText} bind:areaFocused />
</div>
