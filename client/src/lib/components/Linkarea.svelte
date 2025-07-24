<script lang="ts">
	let text = $state("");
	let isFocused = $state(false);
</script>

<div class="font-main relative text-white">
	<textarea
		class="bg-medal-black outline-medal-lgray h-52 w-full resize-none overflow-y-auto rounded-2xl px-4 py-2 font-mono outline-2 focus:outline-2"
		id="input"
		bind:value={text}
		bind:focused={isFocused}
	></textarea>
	{#if !text && !isFocused}
		<label class="absolute top-2 left-4 font-bold" for="input">
			Paste your <span class="text-medal-lime">links</span> here, separated by a line
		</label>
	{/if}
</div>
