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
	export let data: string[] = []
	// TODO: should throw an error when data is undefined by prop?
	// ... see if there are ways to this on compile time instead of run-time
	// ... and use a super class or something when autocomplete need not be used
	// This is a stub for now:
	onMount(() => {
		if (data.length == 0)
			console.warn('Autocmplete element instansiated wihtouth any data being supplied')
	})

	// DOM reference to input text field
	let textFieldValue: string

	// Character-wise matches
	let matches: string[]

	function handleInputChange() {
		matches = dataMatches(textFieldValue, data)
	}

	function dataMatches(input: string, data: string[]): string[] {
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

	function handleSelectFromInput() {
		matches = []
	}
</script>

<SelectableInput
	{placeholderText}
	bind:textFieldValue
	on:input={handleInputChange}
	on:selected={handleSelectFromInput}
	bind:listItems={matches}
/>
