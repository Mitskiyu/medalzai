<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	let { inputText = $bindable(), areaFocused = $bindable() } = $props();

	function handleBlur() {
		areaFocused = false;

		if (page.url.pathname === "/" && inputText && inputText.trim()) {
			goto("/download");
		}

		if (inputText && inputText.trim()) {
			cleanText();
		}
	}

	function handleFocus() {
		areaFocused = true;
	}

	function cleanText() {
		if (!inputText) return;
		let urls = [];
		const lines = inputText.split("\n");

		for (let line of lines) {
			line = line.trim();
			if (line.length === 0) continue;

			const separated = line.replace(/https:\/\/medal\.tv\//g, "\nhttps://medal.tv/").trim();
			const foundUrls = separated.split("\n").filter((url: string) => url.length > 0);

			urls.push(...foundUrls);
		}

		const newText = urls.join("\n");
		if (newText !== inputText) {
			inputText = newText;
		}
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
