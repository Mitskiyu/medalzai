<script lang="ts">
	import { page } from "$app/state";
	import { Download, Settings2, Info } from "@lucide/svelte";
	import Medal from "../icons/Medal.svelte";
	const items = [
		{
			name: "Medal",
			url: "/",
			activePath: (pathname: string) => pathname === "/",
			icon: Medal,
		},
		{
			name: "Download",
			url: "/download",
			activePath: (pathname: string) => pathname === "/download",
			icon: Download,
		},
		{
			name: "Settings",
			url: "/settings",
			activePath: (pathname: string) => pathname === "/settings",
			icon: Settings2,
		},
		{
			name: "About",
			url: "/about",
			activePath: (pathname: string) => pathname === "/about",
			icon: Info,
		},
	];
</script>

<div
	class="bg-medal-gray font-main flex h-22 w-full flex-row items-center justify-between gap-x-4 rounded-2xl px-6 py-2 text-lg font-bold text-white"
>
	{#each items as item (item.name)}
		{@const isActive = item.activePath(page.url.pathname)}

		{#if item.name === "Medal"}
			<a href={item.url}>
				<item.icon iconSize="68" iconColor={isActive ? "var(--color-medal-lime)" : "white"} />
			</a>
		{:else}
			<a
				href={item.url}
				class={`flex flex-row items-center gap-x-1 ${isActive ? "text-medal-lime" : "text-white"}`}
			>
				<item.icon size="28" color={isActive ? "var(--color-medal-lime)" : "white"} />
				<p>{item.name}</p>
			</a>
		{/if}
	{/each}
</div>
