<script lang="ts">
	import { page } from "$app/state";
	import { Download, Settings2, Info, type Icon as IconType } from "@lucide/svelte";
	import Medal from "../icons/Medal.svelte";

	type item = {
		name: string;
		href: string;
		activePath: (pathname: string) => boolean;
		icon: typeof IconType;
	};

	const items: item[] = [
		{
			name: "Download",
			href: "/download",
			activePath: (pathname: string) => pathname === "/download",
			icon: Download,
		},
		{
			name: "Settings",
			href: "/settings",
			activePath: (pathname: string) => pathname === "/settings",
			icon: Settings2,
		},
		{
			name: "About",
			href: "/about",
			activePath: (pathname: string) => pathname === "/about",
			icon: Info,
		},
	];

	let home = $derived(page.url.pathname === "/");
</script>

<div
	class="bg-medal-gray font-main flex h-18 w-full flex-row items-center justify-between rounded-2xl px-4 py-2 text-lg font-bold text-white sm:h-22 sm:px-6"
>
	<a href="/" class="hover:opacity-80">
		<Medal
			className={`${home ? "text-medal-lime" : "text-white"} size-13 sm:h-16 sm:w-16 hover:opacity-80`}
		/>
	</a>

	{#each items as item (item.name)}
		{@const Icon = item.icon}
		{@const isActive = item.activePath(page.url.pathname)}
		<a
			href={item.href}
			class={`flex flex-row items-center gap-x-2 hover:opacity-80 ${isActive ? "text-medal-lime" : "text-white"}`}
		>
			<Icon class="size-8" />
			<span class="hidden sm:block">{item.name}</span>
		</a>
	{/each}
</div>
