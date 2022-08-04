<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'
	import type { SelectedEvent } from './Events'

	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

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

	export let hiddenContentClass: string = ''

	// Used to forward select events from Selectable Input
	let selectedDispatcher: SelectedEvent = createEventDispatcher()

	// Bound to Hidden component in order to hide when a selected event is recieved
	let hidden: boolean = true

	// Hoock checks that empty input is not regarded as valid.
	function selectedHook(value: HTMLInputElement['value']) {
		if (value != '') {
			selectedDispatcher('selected', value)
			textFieldValue = ''
		}
		// Resets ui either way
		hidden = true
	}
</script>

<Hidden bind:hidden on:canceled={() => (textFieldValue = '')}>
	<div slot="placeholderContent">
		<slot name="placeholderContent" />
	</div>
	<div slot="hiddenContent" class={hiddenContentClass}>
		<SelectableInput
			{placeholderText}
			on:selected={(event) => selectedHook(event.detail)}
			bind:value={textFieldValue}
			on:input
		/>
		<!-- Used to insert for example autocomplete list -->
		<slot name="list" />
	</div>
</Hidden>
