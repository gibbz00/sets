<script lang="ts">
	/*
        Description:
            Parent component to be used independently, or by AutoComplete and EllipsisMenu

            X Reveal
                X Standard behaviour is to reveal the content when the component is clicked
                X However, the is the option to explicitly define which element triggers the input reveal
                X This should ovverride the standard behaviour
                    X (Needed for EllipsisMenu)
						X Multiple stop propagations need to be used for elments that shouldn't trigger the show input
							Not sure if there is a better way to solve this right now
            X Cancelation:
                X Methods
                    X Pressing escape 
                    X Clicking outside of Hidden
            * Both selection and cancelation reset UI to initial state
            * Input text field
                * Option to have automatic width based on current input,
                    see InputWidthAutoResize.ts action
                * Option to se input to be of absolute positioning,
                    see CenterToParent.ts action
            * Ability to pass down inputStyles as prop

            // TODO: add reaming requirements that overlap between intial AutoComplete and Hover change component



        Tests: 
            * No hidden content is supplied (done)
            * fallback is being used (done)
            * fallback is not being used (done)
            * fallback is being used with optionalRevealTarget (done)
            * fallback not used, optionalRevealTarget is (done)
			* Pressing inside of component does not drigger cancelation (done)
				* test with an absolute child element too (similar to menu) 
			* Pressing outisde of component triggers cancelation (done)
				* Can be done more than once (done)
			* Pressing escape cancels (done)
    */

	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import type { CanceledEvent } from './Events'

	export let hidden: boolean = true

	// Used for events targeting either visibility state
	let container: HTMLDivElement

	// Enables the ability to specify the use of slots an explicit reveal button
	// Default behaviour is uses the entire component as click target
	// Choise is done at onMount()
	let optionalRevealTarget: HTMLDivElement
	let defaultRevealTarget: HTMLDivElement

	// Chosing reveal botton target
	let target: HTMLDivElement

	let canceledDispather: CanceledEvent = createEventDispatcher()

	onMount(() => {
		// Warns if no placeholder is explicitly set
		if (!$$slots.placeholderContent) {
			console.warn('Fallback placeholderContent is being used for Hidden and revealButton')
		}

		// Runtime error of no hidden content is supplied.
		//		Check if this can be done at compile time, and with slot autocompletion
		if (!$$slots.hiddenContent) {
			throw new Error('No hiddenContent slot found when attempting to mount Hidden.svelte')
		}

		target = $$slots.revealButton ? optionalRevealTarget : defaultRevealTarget
		target.addEventListener('click', () => {
			hidden = false
		})
	})

	function checkCancelOnClick(target: EventTarget | null) {
		// Second conditional ensures that component is not immediatedly closed upon reveal
		if (target != null && !container.contains(target as Node) && hidden == false) cancel()
	}

	function checkCancelOnKey(key: KeyboardEvent['key']) {
		if (hidden == false && key == 'Escape') cancel()
	}

	function cancel() {
		hidden = true
		canceledDispather('canceled')
	}
</script>

<svelte:window
	on:click|capture={(event) => checkCancelOnClick(event.target)}
	on:keydown|capture={(event) => checkCancelOnKey(event.key)}
/>

<!-- Hiding elements with class directives instead of svelte if statements to avoid having to readd event listeners -->
<div bind:this={container}>
	<div bind:this={defaultRevealTarget} class={`${hidden ? '' : 'hidden'}`}>
		<slot name="placeholderContent">
			<buton>Show Hidden</buton>
		</slot>
		{#if $$slots.revealButton}
			<div bind:this={optionalRevealTarget}>
				<slot name="revealButton" />
			</div>
		{/if}
	</div>
	<div class={`${hidden ? 'hidden' : ''}`}>
		<slot name="hiddenContent" />
	</div>
</div>
