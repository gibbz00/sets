<script lang="ts">
	import Icon from '$lib/Icon.svelte'

	/*
        Add a clickable arrow beside input element for mouse/tap driven users

        Tests:
			* Selected event can be dispatches by
				* Pressing enter (done)
				* Clicking arrow icon (done)
            * Selected event can be listened to on parent component (done)
    */

	import { createEventDispatcher } from 'svelte'
	import type { SelectedEvent } from './Events'

	export let value: string = ''
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
	<input class="focus-visible:outline-none" type="text" bind:value bind:this={textField} />
	<button
		on:click={() => {
			selectedDispatcher('selected', textField.value)
		}}
	>
		<Icon type="arrowRightAlt" />
	</button>
</div>
