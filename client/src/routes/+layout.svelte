<script lang="ts">
	import "../app.css";
	import { Navbar } from "$lib/components";

	let { children } = $props();
</script>

<div class="mx-auto mt-8 mb-4 min-h-screen max-w-xl px-4">
	<Navbar />
	{@render children()}
</div>
