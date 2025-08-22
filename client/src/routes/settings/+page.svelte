<script lang="ts">
	import { Settings2 } from "@lucide/svelte";
	import { Settingspanel } from "$lib/components";
</script>

<div class="w-full">
	<div class="mt-4 flex items-center justify-center space-x-2">
		<Settings2 size="52" color="white" />
		<h1 class="text-4xl font-bold text-white">Settings</h1>
	</div>
	<div class="mt-6">
		<Settingspanel />
	</div>
</div>
