<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'
	import type { CanceledEvent, SelectedEvent } from './Events'

	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

     Test:
      * Enter on empty input dispatches canceled
      * Passes up selected event 
      * Can pass down input value
    */

	// Used to forward select events from Selectable Input
	let selectedDispatcher: SelectedEvent = createEventDispatcher()
	let canceledDispatcher: CanceledEvent = createEventDispatcher()

	// Hoock checks that empty input is not regarded as valid.
	// It it happens, it passes a cancled event intead
	function selectedHook(value: HTMLInputElement['value']) {
		if (value == '') {
			canceledDispatcher('canceled')
		} else {
			selectedDispatcher('selected', value)
		}
	}
</script>

<Hidden>
	<SelectableInput slot="hiddenContent" on:selected={(event) => selectedHook(event.detail)} />
</Hidden>
