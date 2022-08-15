<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'

	/*
        Separated Intereracive list from Selectable Input

        TODO:

		* Selection sends selected event
        * List items is supplied by the data prop 
        * List items can be filterered with the filterFunction 
        * Showing list items
            * Pressing down arrow before any input shows all options 
            * They're otherwise just shown after the first first input event 
            * Reverting back to empty input shows all options 
        * List to textFieldValue does not trigger selection immediatedly 
                User might want to edit text before selecting (submitting)
            * Done by:
                * Clicking on list-item 
                * Arrow up or down 
                * Arrow up on first index moved index to last.
        * Option to have automatic width based on current input,
    */
	export let filterKey: string
	export let listItems: string[] = []
	export let listFilter:
		| ((filterKey: string, items: typeof listItems) => typeof listItems)
		| undefined = undefined
	let cls: string = ''
	export { cls as class }

	let matches: string[] = []
	$: matches = findMatches(filterKey)
	/* 
		TODO: Would be nice to have integer types 
			Possible solutions:
				* Uint16Array with only one element
				* BigInt
				* Typescript type using modulo == 0
	*/
	let selectedIndex: number | undefined = undefined
	//IMPROVEMENT: Would be nice to make this into a monad or something that hides the 'selected' argument
	let selectedDispatcher: (type: 'selected', selected: string) => boolean =
		createEventDispatcher()

	//TODO select first item, if there is one
	onMount(() => {})

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter') selectedDispatcher('selected', matches[selectedIndex])
		else if (listItems.length > 0) {
			switch (event.key) {
				case 'ArrowDown':
					if (selectedIndex == undefined) {
						if (matches.length > 0) {
							selectedIndex = 0
						}
					} else if (selectedIndex + 1 != matches.length) {
						selectedIndex++
					} else {
						selectedIndex = 0
					}
					break
				case 'ArrowUp':
					// TODO: whow is this handled with under new refactoring
					// event.preventDefault() called to prevent cursor jump to input beginning
					event.preventDefault()
					if (selectedIndex != undefined) {
						if (selectedIndex == 0) {
							selectedIndex = matches.length - 1
						} else {
							selectedIndex--
						}
					}
					break
			}
		}
	}

	function findMatches(filterKey: string): string[] {
		let matches: string[]
		if (listFilter != undefined) {
			matches = listFilter(filterKey, listItems)
		} else {
			matches = listItems
		}
		selectedIndex = undefined
		return matches
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- Conditional required since an empty ul still renders its borders -->
<!-- IMPROVEMENT?: Event listener might be added to just ul in order to avoid having one for each list-item -->
<ul
	class={`
				${matches.length == 0 ? 'hidden' : ''}
				min-w-max 
				max-w-sm
				text-left 
				bg-white 
				border-2 
				rounded-sm 
				shadow-sm 
				border-gray 
				divide-y-2 
				divide-slate-100
			${cls}`}
>
	{#each matches as match, index}
		<li
			on:click={() => selectedDispatcher('selected', match)}
			class={`cursor-pointer hover:bg-gray-200 px-3 py-2 ${
				selectedIndex == index ? 'bg-gray-100' : ''
			}`}
		>
			{match}
		</li>
	{/each}
</ul>
