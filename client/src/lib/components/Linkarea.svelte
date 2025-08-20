<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { appState, settingsState } from "$lib/state/index.svelte";
	import { processUrls } from "$lib/video";

	let {
		inputText = $bindable(),
		areaFocused = $bindable(),
		onAreaChange = null,
		onInvalidUrl = null,
		onDuplicatesRemoved = null,
	} = $props<{
		inputText: string;
		areaFocused: boolean;
		onAreaChange?: (() => void) | null;
		onInvalidUrl?: ((url: string) => void) | null;
		onDuplicatesRemoved?: ((count: number, duplicates: string[]) => void) | null;
	}>();

	function processInput() {
		const processed = processUrls(inputText, settingsState.allowDuplicates);

		processed.invalidUrls.forEach((url) => {
			onInvalidUrl?.(url);
		});

		if (processed.duplicateUrls.length > 0) {
			onDuplicatesRemoved?.(processed.duplicateUrls.length, processed.duplicateUrls);
		}

		appState.validUrls = processed.validUrls;
		onAreaChange?.();

		if (processed.cleanText !== inputText) {
			inputText = processed.cleanText;
		}
	}

	function handleBlur() {
		areaFocused = false;
		if (page.url.pathname === "/" && inputText.trim()) {
			goto("/download");
		}

		if (inputText.trim()) {
			processInput();
		}
	}

	function handleFocus() {
		areaFocused = true;
	}
</script>

<div class="font-main relative text-white">
	<div
		class="bg-medal-black outline-medal-lgray focus-within:outline-medal-orange h-60 w-full rounded-2xl p-4 outline-2 transition duration-200 ease-in-out focus-within:outline-2"
	>
		<textarea
			class="font-main h-full w-full resize-none overflow-x-auto overflow-y-auto bg-transparent whitespace-nowrap text-white outline-none"
			style="scrollbar-width: thin; scrollbar-color: #4b5563 transparent;"
			id="input"
			bind:value={inputText}
			bind:focused={areaFocused}
			onblur={handleBlur}
			onfocus={handleFocus}
		></textarea>
	</div>
	{#if !inputText && !areaFocused}
		<label class="pointer-events-none absolute top-4 left-4 font-bold" for="input">
			Paste your <span class="text-medal-lime">links</span> here, separated by a line
		</label>
	{/if}
</div>
