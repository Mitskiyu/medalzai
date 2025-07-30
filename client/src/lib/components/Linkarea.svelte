<script lang="ts">
	let { inputText = $bindable(), areaFocused = $bindable() } = $props();
	function handleBlur() {
		areaFocused = false;
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
			class="h-full w-full resize-none overflow-x-auto overflow-y-auto bg-transparent font-mono whitespace-nowrap text-white outline-none"
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
