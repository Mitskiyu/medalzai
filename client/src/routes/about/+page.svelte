<script lang="ts">
	import { Info, Github } from "@lucide/svelte";
</script>

<div class="w-full">
	<div class="mt-4 flex items-center justify-center gap-3">
		<Info class="size-10 text-white sm:size-14" />
		<h1 class="text-2xl font-bold text-white sm:text-4xl">About</h1>
	</div>
	<div class="mt-4 sm:mt-8">
		<div class="bg-medal-black font-main rounded-2xl p-4 text-white sm:p-6">
			<div class="flex flex-row items-center gap-3">
				<div
					class="bg-medal-lime flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12"
				>
					<Info class="size-6 sm:size-7" color="black" />
				</div>
				<h3 class="text-lg font-bold sm:text-2xl">Medalzai</h3>
			</div>

			<div class="mt-6 flex flex-col gap-2">
				<h5 class="text-base font-bold sm:text-lg">What is this?</h5>
				<p class="text-sm text-white/60 sm:text-base">
					A free tool for downloading Medal.tv clips. Not affiliated with or endorsed by
					Medal.tv. All clips belong to their respective creators.
				</p>
			</div>

			<div class="mt-8 flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<h5 class="text-base font-bold sm:text-lg">Resources</h5>
					<p class="text-sm text-white/60 sm:text-base">
						Medalzai is open source. You can read the code or contribute at any time.
					</p>
				</div>
				<a
					href="https://github.com/Mitskiyu/medalzai"
					target="_blank"
					rel="noopener noreferrer"
					class="bg-medal-lgray flex flex-1 flex-row items-center justify-center gap-2 rounded-xl p-3 font-bold text-white transition-all duration-200 hover:scale-105 hover:cursor-pointer active:scale-95 sm:p-4"
				>
					<Github class="size-5 sm:size-6" />
					<span class="text-sm sm:text-base">Source Code</span>
				</a>
			</div>
		</div>
	</div>
</div>
