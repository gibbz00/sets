<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'
	import type { CanceledEvent, SelectedEvent } from './Events'

	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

     Test:
      * Enter on empty input cancels the input and resets Hidden
      * Passes up selected event and resets Hidden (done)
      * Should clear previous input
      * Shown input is autofocused
    */

	// Used to forward select events from Selectable Input
	let selectedDispatcher: SelectedEvent = createEventDispatcher()

	// Bound to Hidden component in order to hide when a selected event is recieved
	let hidden: boolean = true
	let textFieldValue: string = ''

	// Hoock checks that empty input is not regarded as valid.
	function selectedHook(value: HTMLInputElement['value']) {
		if (value != '') selectedDispatcher('selected', value)
		// Resets ui either way
		hidden = true
	}
</script>

<Hidden bind:hidden on:canceled={() => (textFieldValue = '')}>
	<SelectableInput
		slot="hiddenContent"
		on:selected={(event) => selectedHook(event.detail)}
		bind:value={textFieldValue}
	/>
</Hidden>
