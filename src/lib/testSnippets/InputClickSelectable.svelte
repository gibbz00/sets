<script lang="ts">
	import Icon from '$lib/Icon.svelte'

	/*
        Add a clickable arrow beside inputs for mouse/tap driven users

        Tests:
            * Selected event can be listened to on parent component
    */

	import { createEventDispatcher } from 'svelte'
	import type { SelectedEvent } from './SelectedEvent'

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
>
	<input class="focus-visible:outline-none" type="text" bind:this={textField} />
	<button
		on:click={() => {
			selectedDispatcher('selected', textField.value)
		}}
	>
		<Icon type="arrowRightAlt" />
	</button>
</div>
