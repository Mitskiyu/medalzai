<script lang="ts">
	import { goto } from "$app/navigation";
	import { appState } from "$lib/state/index.svelte";
	import { Linkarea } from "$lib/components";

	let areaFocused = $state<boolean>(false);
	let previousFocused = $state<boolean>(true);

	$effect(() => {
		if (previousFocused && !areaFocused && appState.inputText.trim() && !appState.redirected) {
			appState.redirected = true;
			goto("/download");
		}
		previousFocused = areaFocused;
	});
</script>

<div class="mt-16 flex flex-col items-center justify-center font-bold text-white">
	<h1 class="text-4xl">
		Download <span class="text-medal-lime">Medal</span> clips
	</h1>
	<h2 class="text-medal-lgray text-shadow-medal-gray text-3xl text-shadow-lg">
		Save in bulk, fast &amp watermark-free
	</h2>
</div>
<div class="mt-8 w-full">
	<Linkarea bind:inputText={appState.inputText} bind:areaFocused />
</div>
