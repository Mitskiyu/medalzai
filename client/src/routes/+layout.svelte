<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<div class="mx-auto mt-8 min-h-screen max-w-xl px-4">
	{@render children()}
</div>
