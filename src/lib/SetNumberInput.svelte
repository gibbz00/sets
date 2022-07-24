<script lang="ts">
	export let set: number
	//TODO: proper type-settings
	export let justify: string
</script>

<!-- "BUG": cant pass tailwind classes to class:directive in at least HMR dev mode -->
<div class={`group flex ${justify}`}>
	<button
		class="w-7 text-gray-400 group-hover:text-black"
		on:click={() => set--}>-</button
	>
	<input
		class="w-7 text-center invalid:text-rose-600"
		min="0"
		step="1"
		type="number"
		bind:value={set}
	/>
	<button
		class="w-7 text-gray-400 group-hover:text-black"
		on:click={() => set++}>+</button
	>
</div>
