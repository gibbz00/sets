<script lang="ts">
	import { onMount } from 'svelte'
	import SelectableInput from './SelectableInput.svelte'

	/*
		Additional cancelation and selection logic:

        Description:
            * Autoselect option
                * Case-sensitive whole pattern matching starting only at first index 
                * Pressing down arrow before any input shows all options
				* Reverting back to empty input shows all options
                * Input changes filter the list automatically
    */

	export let placeholderText: string = ''
	// Array used for cross-referencing
	// TODO: should throw an error when data is undefined by prop?
	// ... see if there are ways to this on compile time instead of run-time
	// ... and use a super class or something when autocomplete need not be used
	// This is a stub for now:
	export let data: string[] = []

	onMount(() => {
		if (data.length == 0) throw new Error('Autocomplete mounted without any data supplied')
	})

	function filterFunction(input: string): string[] {
		// At first, every element in data is a potential match
		// Then we iterate over each letter of the input and pick only those match charachter-wise
		let potentialMatches: string[] = data
		for (let index = 0; index < input.length; index++) {
			potentialMatches = potentialMatches.filter((potentialMatch) => {
				if (potentialMatch.charAt(index) == input.charAt(index)) {
					return potentialMatch
				}
			})
		}
		return potentialMatches
	}
</script>

<SelectableInput listItems={data} listFilter={filterFunction} {placeholderText} />
