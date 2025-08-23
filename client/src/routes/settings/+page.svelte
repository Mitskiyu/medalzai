<script lang="ts">
	import { Settings2 } from "@lucide/svelte";
	import { Settingspanel } from "$lib/components";
</script>

<div class="w-full">
	<div class="mt-4 flex items-center justify-center gap-3">
		<Settings2 class="size-10 text-white sm:size-14" />
		<h1 class="text-2xl font-bold text-white sm:text-4xl">Settings</h1>
	</div>
	<div class="mt-4 sm:mt-8">
		<Settingspanel />
	</div>
</div>
