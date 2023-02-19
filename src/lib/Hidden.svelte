<script lang="ts">
	/*
			Hides arbitrary content and reveal it with SpecifiedRevealTarget

            X Cancelation:
                X Methods
                    X Pressing escape 
                    X Clicking outside of Hidden
				* Cancelation resets UI to initial state

			// Option to preserve placeholderContent to the same height as hiddenContent in those case where the height is not explicitly set.

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

	import { onMount, afterUpdate } from 'svelte'
	import { fade, type FadeParams } from 'svelte/transition'
	import SpecifiedRevealTarget from './SpecifiedRevealTarget.svelte'
	import {
		fadeInDelay,
		fadeOutDelay,
		fadeInDuration,
		fadeOutDuration,
	} from './transitionConstants'

	let cls: string = "";
	export {cls as class}
	export let hidden: boolean = true
	export let preservePlaceholderHeight: boolean = true
	export let fadeTransition: boolean = false

	// Used for events targeting either visibility state
	let container: HTMLDivElement
	let placeholderContent: HTMLDivElement
	let placeholderContentHeight: number
	let hiddenContent: HTMLDivElement

	onMount(() => {
		//TODO: Check if this can be done at compile time
		if (!$$slots.hiddenContent) {
			throw new Error('No hiddenContent slot found when attempting to mount Hidden.svelte')
		}

		// IMPROVEMENT the functionality should be possible to implement by using invisible components,
		// similar to how DynamicInputWitdh works.
		if (preservePlaceholderHeight == true) {
			if (hidden == false) {
				throw new Error(
					'Preserving hiddenContent height currently not posssible when hiddenContent is shown by default'
				)
			}
			placeholderContentHeight = placeholderContent.clientHeight
		}
	})

	afterUpdate(() => {
		if (hidden == false) {
			hiddenContent.style.height = `${placeholderContentHeight}px`
		}
	})

	function checkCancelOnClick(target: EventTarget | null) {
		// Second conditional ensures that component is not immediatedly closed upon reveal
		if (target != null && !container.contains(target as Node) && hidden == false) {
			hidden = true
		}
	}

	function checkCancelOnKey(event: KeyboardEvent) {
		if (hidden == false && event.key == 'Escape') {
			hidden = true
			// For those cases when component is nested in other Hidden componenents etc.
			event.stopPropagation()
		}
	}

	function emptyTransition(node: Element, emptyParameter: FadeParams): Object {
		return {}
	}
	let chosenTransition = fadeTransition ? fade : emptyTransition
</script>

<svelte:window
	on:click|capture={(event) => checkCancelOnClick(event.target)}
	on:keydown|capture={(event) => checkCancelOnKey(event)}
/>

<div
	class={cls}
	bind:this={container}
	in:chosenTransition|local={{
		delay: fadeInDelay,
		duration: fadeInDuration,
	}}
	out:chosenTransition|local={{
		delay: fadeOutDelay,
		duration: fadeOutDuration,
	}}
>
	{#if hidden}
		<div bind:this={placeholderContent}>
			<SpecifiedRevealTarget
				on:reveal={() => {
					hidden = false
				}}
			>
				<slot slot="placeholderContent" name="placeholderContent" />
			</SpecifiedRevealTarget>
		</div>
	{:else}
		<div bind:this={hiddenContent}>
			<slot name="hiddenContent" />
		</div>
	{/if}
</div>
