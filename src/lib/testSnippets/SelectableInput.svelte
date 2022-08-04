<script lang="ts">
	import Icon from '$lib/Icon.svelte'

	/*
        Add a clickable arrow beside input element for mouse/tap driven users

		* Option to have automatic width based on current input,
			see InputWidthAutoResize.ts action
		* Option to set input to be of absolute positioning,
			see CenterToParent.ts action
		* Ability to pass down inputStyles as prop

        Tests:
			* Selected event can be dispatches by
			 	* Pressing enter (done)
				* Clicking arrow icon (done)
            * Selected event can be listened to on parent component (done)
    */

	import { createEventDispatcher } from 'svelte'
	import type { SelectedEvent } from './Events'

	export let value: string = ''
	export let placeholderText: string = ''
	let selectedDispatcher: SelectedEvent = createEventDispatcher()
	let textField: HTMLInputElement
</script>

<div
	class="
		w-max
		flex
		border-2 
		border-gray-500/20
		focus-within:border-blue-500
	"
	on:keydown={(event) => {
		if (event.key == 'Enter') {
			selectedDispatcher('selected', textField.value)
		}
	}}
>
	<!-- 
		ORDER MATTERS!!!
			* bind:value must come before on:input 
				* otherwise on:input will use old value
	-->
	<input
		class="focus-visible:outline-none"
		type="text"
		placeholder={placeholderText}
		bind:value
		bind:this={textField}
		on:input
	/>
	<button
		on:click={() => {
			selectedDispatcher('selected', textField.value)
		}}
	>
		<Icon type="arrowRightAlt" />
	</button>
</div>
