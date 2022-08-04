<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import HiddenInput from './HiddenInput.svelte'
	import type SelectableInput from './SelectableInput.svelte'

	/*
        Description:
            * Selection:
                * Pressing enter on non-empty input
                * Clicking shown list
                * Arrow up or down and pressing enter on selected list item
            * Cancelation:
                * Methods
                    * Pressing escape 
                    * Clicking outside of input
                    * Enterering a empty input 
            * Both selection and cancelation reset UI to initial state
            * Autoselect option
                * Case-sensitive whole pattern matching starting only at first index  
                * Pressing down arrow before any input shows all options
                * Input changes filter the list automatically
                    * Reverting back to empty input shows all options
            * No autoselect option
                * Up and down arrows do nothing
                * No list is shown
            * Input text field
                * Automatic width based on current input
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
	let textField: SelectableInput
	let textFieldValue: string

	// Selected autocomplete index
	let selectedIndex: bigint | undefined = undefined

	// Character-wise matches
	let matches: string[]

	// Event dispatcher for input changes, dispatchEvent(new Event("input")) not used since on: directive can't hear these
	let inputChangeEventDispatcher: (type: 'input') => boolean = createEventDispatcher()

	/* TODO:
		When input changes: update matches 	// matches = dataMatches(input, data)
			Things that should trigger and input change but aren't by on:input
				* typing in textField
				* selecting an element in the autocomplete list	
					* click and updown arrow
					* such actions should trigger manually trigger an input event, this must be done with a svelte dispatcher, not the standard
						* the standard element.dispatchEvent(new Event("input")) on be heard by on:input

	*/
	function handleInputChange() {
		matches = dataMatches(textFieldValue, data)
	}

	// Move inside the ul selection logic
	function selected(selected: string) {
		textFieldValue = selected
		inputChangeEventDispatcher('input')
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

<HiddenInput
	{placeholderText}
	bind:textFieldValue
	on:input={handleInputChange}
	on:selected={handleSelectFromInput}
	hiddenContentClass="relative border-2 border-purple-500 w-min"
>
	<button
		slot="placeholderContent"
		class="
				text-2xl 
				rounded-full 
				hover:bg-gray-200 
				w-8 
				h-full
			"
	>
		+
	</button>
	<!-- Has to be place for it to be clickable without content becoming hidden -->
	<div slot="list">
		<!-- First conditional for when matches hasn't been initialized  -->
		<!-- Second conditional required since an empty ul still renders its borders -->
		{#if matches && matches.length > 0}
			<!-- Top offset calculated from action -->
			<ul
				class="absolute z-10 inset-x-0 min-w-max text-left bg-white border-2 divide-y-2 rounded-sm shadow-sm border-gray divide-slate-100"
			>
				<!-- TODO: add class: class={`${index == selectedIndex ? 'bg-gray-100' : ''} px-3 py-2`}  -->
				{#each matches as match, index}
					<li>{match}</li>
				{/each}
			</ul>
		{/if}
	</div>
</HiddenInput>
