<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import "../app.css";
	import { Navbar } from "$lib/components";

	let { children } = $props();
</script>

<div class="mx-auto mt-8 mb-4 min-h-screen max-w-xl px-4">
	<Toaster richColors toastOptions={{ class: "whitespace-pre-line" }} />
	<Navbar />
	{@render children()}
</div>
