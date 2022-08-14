<script lang="ts">
	/*
		* Default target is the component as a whole.
		* The id "revealTarget" can optionally be used to explicity set the 
		reveal target to a child-element of the fplaceholderContent slot 
		* If multiple hidden nested components are used which eventually reveal a #revealTarget...
		then don't forget to add on:click|stopPropagation to slot="placeHolderContent" in all the parents!

		* The main reason behind the component separation is that content inside the {#if hidden} relies on onMount logic
		* This means that a class="hidden" won't work.
		* But then the event-lister that determines the reveal target must be added each time hidden is set to true
		* Becomes cumbersomve since hidden is an export prop that can change outside of the control of Hidden.svelte 
		* A afterUpdate() isn't used because it can't solve the cases such as when #revealTarget exists in the hiddenContent slot of a nested Hidden.
		* *Upate() events aren't fired when a child component is udpated.
		* Hence the separate component that with a MutationObserver
	*/

	import { onMount, createEventDispatcher, onDestroy } from 'svelte'

	let dispatcher = createEventDispatcher()

	// Can't check existense of slot using $$slots.* for slots that are pased down from Hidden.svelte
	// SlotWrappers are instead used where existence is checkeck with .childElementCount > 0 contidion
	let placeholderContentSlotWrapper: HTMLDivElement

	let mutationObserver: MutationObserver
	let revealed = false

	onMount(() => {
		if (placeholderContentSlotWrapper.childElementCount == 0) {
			throw new Error('No placeholderContent is being used for RevealTarget.svelte')
		}

		chooseTarget()

		mutationObserver = new MutationObserver(() => {
			chooseTarget()
		})
		mutationObserver.observe(placeholderContentSlotWrapper, { childList: true, subtree: true })

		function chooseTarget() {
			// Conditional used becuase the observer is still trigered just before SpecifiedRevealTarget (this) is destroyed
			if (placeholderContentSlotWrapper != null) {
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
					mutationObserver.disconnect()
					// The dispatched event will cause the parent to update and show hiddenContent first by default, not entirely sure why
					// (debugging shows that it becomes "dirty first")
					// Anyways, having the revealed boolean set to true before the dispatcher ensures that SpecifiedRevealTarget becomes "dirty" before parent.
					revealed = true
					dispatcher('reveal')
				})
			}
		}
	})
</script>

{#if !revealed}
	<div bind:this={placeholderContentSlotWrapper}>
		<slot name="placeholderContent" />
	</div>
{/if}
