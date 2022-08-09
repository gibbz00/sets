<script lang="ts">
	export let set: number
	//TODO: proper type-settings
</script>

<!-- "BUG": cant pass tailwind classes to class:directive in at least HMR dev mode -->
<div class={`group flex`}>
	<button
		class="text-gray-400 w-7 group-hover:text-black"
		disabled={set == 0 ? true : false}
		style:color={set == 0 ? 'grey' : ''}
		on:click={() => set--}>-</button
	>
	<input
		class="text-center w-7 invalid:text-rose-600"
		min="0"
		step="1"
		type="number"
		bind:value={set}
	/>
	<button class="text-gray-400 w-7 group-hover:text-black" on:click={() => set++}>+</button>
</div>
