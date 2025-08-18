<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import { fly } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { Toaster } from "svelte-sonner";
	import { appState } from "$lib/state/index.svelte";
	import { Navbar } from "$lib/components";

	let { children } = $props();
	let routeId = $derived(page.route.id);
	const pageOrder = ["/", "/download", "/settings", "/about"];

	let goingLeft = $derived.by(() => {
		if (!routeId || !appState.previousPath || routeId === appState.previousPath) {
			return false;
		}

		const currentIndex = pageOrder.indexOf(routeId);
		const previousIndex = pageOrder.indexOf(appState.previousPath);

		if (currentIndex !== -1 && previousIndex !== -1) {
			const direction = currentIndex < previousIndex;
			return direction;
		}

		return false;
	});

	$effect(() => {
		if (routeId && routeId !== appState.previousPath) {
			appState.previousPath = routeId;
		}
	});
</script>

<div class="mx-auto mt-8 mb-4 min-h-screen max-w-xl px-4">
	<Toaster richColors toastOptions={{ class: "whitespace-pre-line" }} />
	<Navbar />
	<div class="grid flex-grow grid-cols-1 grid-rows-1">
		{#key routeId}
			<div
				class="col-start-1 row-start-1"
				in:fly={{
					x: goingLeft ? -window.innerWidth : window.innerWidth,
					duration: 300,
					easing: quintOut,
					delay: 50,
				}}
				out:fly={{
					x: goingLeft ? window.innerWidth : -window.innerWidth,
					duration: 200,
					easing: quintOut,
				}}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
