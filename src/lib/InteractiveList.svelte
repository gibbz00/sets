<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'

	/*
        Separated Intereracive list from Selectable Input

        TODO:
		* List traversal with keyboard only possible when list is focused. 
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
	type ListFilter = undefined | ((filterKey: string, items: typeof listItems) => typeof listItems)
	export let listFilter: ListFilter = undefined
	let cls: string = ''
	export { cls as class }
	export let keyHandlingActivated: boolean = false
	export let autofocus: boolean = false

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

	let list: HTMLUListElement
	function handleKeyDown(event: KeyboardEvent) {
		if (keyHandlingActivated || document.activeElement == list) {
			if (event.key == 'Enter' && selectedIndex != undefined)
				selectedDispatcher('selected', matches[selectedIndex])
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
	{autofocus}
	bind:this={list}
	on:mouseenter={() => list.focus()}
	tabindex="0"
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
			on:mouseenter={() => (selectedIndex = index)}
			class={`cursor-pointer hover:bg-gray-200 px-3 py-2 ${
				selectedIndex == index ? 'bg-gray-100' : ''
			}`}
		>
			{match}
		</li>
	{/each}
</ul>
