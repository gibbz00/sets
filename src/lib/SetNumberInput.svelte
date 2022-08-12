<script lang="ts">
	import { fade } from 'svelte/transition'
	import {
		fadeInDelay,
		fadeInDuration,
		fadeOutDelay,
		fadeOutDuration,
	} from '$lib/transitionConstants'

	export let set: number
</script>

<!-- in/out:fade transition used for in table that has height transtion, see HeightTransition for more on why -->
<div
	class="group flex"
	in:fade={{
		delay: fadeInDelay,
		duration: fadeInDuration,
	}}
	out:fade={{
		delay: fadeOutDelay,
		duration: fadeOutDuration,
	}}
>
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
