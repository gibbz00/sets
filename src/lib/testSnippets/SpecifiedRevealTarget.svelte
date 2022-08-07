<script lang="ts">
	/*
		Used to specify reveal target. Either the component as a hole, or a child element of the component.

		TODO: 
		* A better way might be to create a slot prop that tags the component that should reveal hidden.
			Might be done with checking fo a special id


		* The main reason behind the component separation is that content inside the {#if hidden} relies on onMount logic
		* This means that a class="hidden" won't work.
		* But then the event-lister that determines the reveal target must be added each time hidden is set to true
		* Becomes cumbersomve since hidden is an export prop that can change outside of the control of Hidden.svelte 
		* (could be done with and if hidden = true in afterUpdate(), but fragile so; meh)
		* Hence a separate component.
	*/

	import { onMount, createEventDispatcher } from 'svelte'

	let dispatcher = createEventDispatcher()

	// Can't check existense of slot using $$slots.* for slots that are pased down from Hidden.svelte
	// SlotWrappers are instead used where existence is checkeck with .childElementCount > 0 contidion
	let placeholderContentSlotWrapper: HTMLDivElement

	onMount(() => {
		// Warns if no placeholder is explicitly set
		if (placeholderContentSlotWrapper.childElementCount == 0) {
			throw new Error('No placeholderContent is being used for RevealTarget.svelte')
		}

		let specifiedRevealTargets: NodeListOf<HTMLElement> =
			placeholderContentSlotWrapper.querySelectorAll('#revealTarget')

		if (specifiedRevealTargets.length > 1) {
			throw new Error(
				'Multiple reveal targets found for Hidden component, only one is currenlty suported'
			)
		}

		;(specifiedRevealTargets.length == 1
			? specifiedRevealTargets[0]
			: placeholderContentSlotWrapper
		).addEventListener('click', () => {
			dispatcher('reveal')
		})
	})
</script>

<div bind:this={placeholderContentSlotWrapper}>
	<slot name="placeholderContent" />
</div>
