<script lang="ts">
	/*
        Description:
            Parent component to be used independently, or by AutoComplete and EllipsisMenu

            * Reveal
                * Standard behaviour is to reveal the content when the component is clicked
                * However, the is the option to explicitly define which element triggers the input reveal
                * This should ovverride the standard behaviour
                    * (Needed for EllipsisMenu)
            * Selection:
                * This wrapper component is often used to hide inputs, 
                    * Such inputs can dispatch a selected event which have to be forwarded
                    * But also resetUI events, such as when enter is pressed on empty input
            * Cancelation:
                * Methods
                    * Pressing escape 
                    * Clicking outside of Hidden
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
            * fallback is being used with optionalRevealTarget 
            * fallback not used, optionalRevealTarget is (done)
    */

	import { onMount } from 'svelte'

	export let hidden: boolean = true

	// Enables the ability to specify the use of slots an explicit reveal button
	// Default behaviour is uses the entire component as click target
	let optionalRevealTarget: HTMLDivElement
	let defaultRevealTarget: HTMLDivElement

	onMount(() => {
		if (!$$slots.placeholderContent) {
			console.warn('Fallback placeholderContent is being used for Hidden and revealButton')
		}

		if (!$$slots.hiddenContent) {
			throw new Error('No hiddenContent slot found when attempting to mount Hidden.svelte')
		}

		// Chosing reveal botton target
		let target: HTMLDivElement = $$slots.revealButton
			? optionalRevealTarget
			: defaultRevealTarget

		console.log($$slots.revealButton, optionalRevealTarget, defaultRevealTarget, target)
		target.addEventListener('click', () => {
			hidden = false
		})
	})
</script>

{#if hidden}
	<div bind:this={defaultRevealTarget}>
		<slot name="placeholderContent">
			<buton>Show Hidden</buton>
		</slot>
		{#if $$slots.revealButton}
			<div bind:this={optionalRevealTarget}>
				<slot name="revealButton" />
			</div>
		{/if}
	</div>
{:else}
	<slot name="hiddenContent" />
{/if}
