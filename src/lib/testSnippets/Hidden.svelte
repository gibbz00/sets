<script lang="ts">
	/*
			Hides arbitrary content with the use of SpecifiedRevealTarget 

            X Cancelation:
                X Methods
                    X Pressing escape 
                    X Clicking outside of Hidden
				* Cancelation resets UI to initial state

        Tests: 
            * No hidden content is supplied (done)
            * fallback is being used (done)
            * fallback is not being used (done)
            * fallback is being used with optionalRevealTarget (done)
            * fallback not used, optionalRevealTarget is (done)
			* Pressing inside of component does not drigger cancelation (done)
				* test with an absolute child element too (similar to menu) (done)
			* Pressing outisde of component triggers cancelation (done)
				* Can be done more than once (done)
			* Pressing escape cancels (done)
    */

	import { onMount } from 'svelte'
	import SpecifiedRevealTarget from './SpecifiedRevealTarget.svelte'

	export let hidden: boolean = true

	// Used for events targeting either visibility state
	let container: HTMLDivElement

	onMount(() => {
		//TODO: Check if this can be done at compile time
		if (!$$slots.hiddenContent) {
			throw new Error('No hiddenContent slot found when attempting to mount Hidden.svelte')
		}
	})

	function checkCancelOnClick(target: EventTarget | null) {
		// Second conditional ensures that component is not immediatedly closed upon reveal
		if (target != null && !container.contains(target as Node) && hidden == false) {
			hidden = true
		}
	}

	function checkCancelOnKey(key: KeyboardEvent['key']) {
		if (hidden == false && key == 'Escape') {
			hidden = true
		}
	}
</script>

<svelte:window
	on:click|capture={(event) => checkCancelOnClick(event.target)}
	on:keydown|capture={(event) => checkCancelOnKey(event.key)}
/>

<div class="w-min" bind:this={container}>
	{#if hidden}
		<SpecifiedRevealTarget
			on:reveal={() => {
				hidden = false
			}}
		>
			<slot slot="placeholderContent" name="placeholderContent" />
		</SpecifiedRevealTarget>
	{:else}
		<slot name="hiddenContent" />
	{/if}
</div>
