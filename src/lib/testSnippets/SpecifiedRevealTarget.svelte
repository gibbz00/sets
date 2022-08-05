<script lang="ts">
	/*
		Used to specify reveal target. Either the component as a hole, or a child element of the component.

		TODO: A better way might be to create a slot prop that tags the component that should reveal hidden.

		* The main reason behind the component separation is that content inside the {#if hidden} relies on onMount logic
		* This means that a class="hidden" won't work.
		* But then the event-lister that determines the reveal target must be added each time hidden is set to true
		* Something that is not really possible is hidden is an export prop and wherby changes are outside of the control of Hidden.svelte
		* Hence a separate component.
	*/

	import { onMount, createEventDispatcher } from 'svelte'

	let dispatcher = createEventDispatcher()

	// Enables the ability to specify the use of slots an explicit reveal button
	// Default behaviour is uses the entire component as click target
	// Choise is done at onMount()
	let defaultRevealTarget: HTMLDivElement
	// Chosing reveal botton target
	let target: HTMLDivElement

	// Can't check existense of slot using $$slots.* for slots that are pased down from Hidden.svelte
	// SlotWrappers are instead used where existence is checkeck with .childElementCount > 0 contidion
	let placeholderContentSlotWrapper: HTMLDivElement
	let revealButtonSlotWrapper: HTMLDivElement
	let dedicatedRevealButton: boolean = false

	onMount(() => {
		// Warns if no placeholder is explicitly set
		if (placeholderContentSlotWrapper.childElementCount == 0) {
			throw new Error('No placeholderContent is being used for RevealTarget.svelte')
		}

		if (revealButtonSlotWrapper.childElementCount > 0) dedicatedRevealButton = true

		target = dedicatedRevealButton ? revealButtonSlotWrapper : defaultRevealTarget
		target.addEventListener('click', () => {
			dispatcher('reveal')
		})
	})
</script>

<div
	class={`border-2 border-red-500 ${dedicatedRevealButton ? '' : 'cursor-pointer'}`}
	bind:this={defaultRevealTarget}
>
	<div bind:this={placeholderContentSlotWrapper}>
		<slot name="placeholderContent" />
	</div>
	<div class={dedicatedRevealButton ? 'cursor-pointer' : ''} bind:this={revealButtonSlotWrapper}>
		<slot name="optionalRevealTarget" />
	</div>
</div>
