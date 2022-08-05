<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'
	import type { SelectedEvent } from './Events'

	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

	Custom selection and cancelation logic:
		* Enterering a empty input cancels the operation
		* Selection or cancelation reset input value

     Test:
      * Enter on empty input cancels the input and resets Hidden (done)
      * Passes up selected event and resets Hidden (done)
      * Should clear previous input (done)
      * TODO: Shown input is autofocused
      * BUG: Escape has to be pressed twice
  */
	export let placeholderText: string = ''
	// Used for Autocomplete
	export let textFieldValue: string = ''

	// Used to forward select events from Selectable Input
	let selectedDispatcher: SelectedEvent = createEventDispatcher()

	// Bound to Hidden component in order to hide when a selected event is recieved
	let hidden: boolean = true

	// Hook checks that empty input is not regarded as valid.
	function selectedHook(value: HTMLInputElement['value']) {
		console.log('rans')
		if (value != '') {
			selectedDispatcher('selected', value)
		}
		textFieldValue = ''
		hidden = true
	}
</script>

<Hidden
	bind:hidden
	on:selected={(event) => selectedHook(event.detail)}
	on:canceled={() => (textFieldValue = '')}
>
	<slot slot="placeholderContent" name="placeholderContent" />
	<slot slot="optionalRevealTarget" name="optionalRevealTarget" />
	<slot slot="hiddenContent" name="hiddenContent">
		<SelectableInput on:selected {placeholderText} bind:textFieldValue on:input />
	</slot>
</Hidden>
