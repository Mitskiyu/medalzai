<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { appState, settingsState } from "$lib/state/index.svelte";
	import { processUrls } from "$lib/video";

	let {
		inputText = $bindable(),
		areaFocused = $bindable(),
		isLoading = false,
		onAreaChange = null,
		onInvalidUrl = null,
		onDuplicatesRemoved = null,
	} = $props<{
		inputText: string;
		areaFocused: boolean;
		isLoading?: boolean;
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

<style>
	@property --ring-angle {
		syntax: "<angle>";
		inherits: false;
		initial-value: 0deg;
	}

	@keyframes spin-ring {
		to {
			--ring-angle: 360deg;
		}
	}

	.loading-ring {
		background: conic-gradient(from var(--ring-angle), #bef73f 0deg, #bef73f 60deg, #313131 60deg);
		animation: spin-ring 1.6s linear infinite;
	}
</style>

<div class="font-main relative text-white">
	<div class="rounded-2xl p-0.5 {isLoading ? 'loading-ring' : areaFocused ? 'bg-medal-orange' : 'bg-medal-lgray'}">
		<div class="bg-medal-black h-40 w-full rounded-[14px] p-4 sm:h-60">
		<textarea
			class="font-main h-full w-full resize-none overflow-x-auto overflow-y-auto bg-transparent text-sm whitespace-nowrap text-white outline-none sm:text-base"
			style="scrollbar-width: thin; scrollbar-color: #4b5563 transparent;"
			id="input"
			bind:value={inputText}
			bind:focused={areaFocused}
			onblur={handleBlur}
			onfocus={handleFocus}
		></textarea>
		</div>
	</div>
	{#if !inputText && !areaFocused}
		<label
			class="pointer-events-none absolute top-4 left-4 text-sm font-bold sm:text-base"
			for="input"
		>
			Paste your <span class="text-medal-lime">links</span> here, separated by a line
		</label>
	{/if}
</div>
