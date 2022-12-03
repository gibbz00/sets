<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { FilterFunction } from './utils/TypeStub';

	/*
        Separated Intereracive list from Selectable Input

        * List items is supplied by the data prop 
        * List items can be filterered with the filterFunction, used for features such as autocomplete
		* List traversal with keyboard only possible when list is focused. 
			* Keyboard traversal done with up or down arrows.
			* List regarded as cyclic.
		* Selection sends selected event
		* Option to hade select event be triggered upon traversal
        	User might sometimes want to edit selection text before submitting
		* Explicit selection that is not done by traversal is achieved by:
			* Clicking on list-item 
			* Pressing enter key on focused item (only work when selectUponTraversal set to false to avoid double selects)
		* ItemsIntiallyHiddem prop. If set to true:
            * Pressing down arrow before any input shows all options
            * Otherwise also shown after the first first input event 
		* Reverting back to empty filterkey shows all options 
    */
	type ListOptions = {
		items: string[]
		omit?: string[]
		filter?: {
			key: string
			func: FilterFunction 
		}
	}
	export let listOptions: ListOptions

	let cls: string = ''
	export { cls as class }

	export let keyHandlingActivated: boolean = false
	export let autofocus: boolean = false
	export let itemsInitiallyHidden: boolean = false
	export let selectOnTraverse: boolean = false
	export let itemsShown: boolean | undefined


	let matches: string[] = []
	let firstNotFilteredFlip = itemsInitiallyHidden
	$: matches = (() => {
		if (itemsInitiallyHidden) {
			// equivalent to load once statement, even if naming isn't the best
			itemsInitiallyHidden = false
			return []
		}
		// including the argument as its change is the trigger to finding new matches
		// needed to trigger the reactive statement
		return findMatches(listOptions.filter?.key)
	})()
	/* 
		TODO: Would be nice to have integer types 
			Possible Hacks:
				* Uint16Array with only one element
				* BigInt
				* Typescript type using modulo == 0
	*/
	let selectedIndex: number | undefined = undefined
	type InteractiveListSelectedDetail = {
		selected: string,
		method: 'selection' | 'traversal'
	}
	let selectedDispatcher: (type: 'selected', detail: InteractiveListSelectedDetail) => boolean =
		createEventDispatcher()
	
	function itemSelected(selected: string) {
		selectedDispatcher('selected', {
			selected,
			method: 'selection'
		})
		itemsShown = false
	}

	let list: HTMLUListElement
	function handleKeyDown(event: KeyboardEvent) {
		if (keyHandlingActivated || document.activeElement == list) {
			// Traversal check to avoid double selects
			if (event.key == 'Enter' && selectedIndex != undefined && !selectOnTraverse) {
				itemSelected(matches[selectedIndex])
			}
				
			else if (listOptions.items.length > 0) {
				let pressedUpOrDown: boolean = false
				switch (event.key) {
					case 'ArrowDown':
						if (firstNotFilteredFlip) {
							matches = findMatches()
							firstNotFilteredFlip = false
						}

						if (selectedIndex == undefined && matches.length > 0) {
							itemsShown = true
							selectedIndex = 0
						} else if (selectedIndex! + 1 == matches.length) {
							selectedIndex = 0
						} else {
							selectedIndex!++
						}
						pressedUpOrDown = true
						break
					case 'ArrowUp':
						// event.preventDefault() called to prevent cursor jump to input beginning
						event.preventDefault()
						if (selectedIndex == undefined && matches.length > 0) {
							selectedIndex = matches.length - 1
						}
						else {
							if (selectedIndex == 0) {
								selectedIndex = matches.length - 1
							} else {
								selectedIndex!--
							}
						}
						pressedUpOrDown = true
						break
				}
				if (pressedUpOrDown && selectOnTraverse) {
					selectedDispatcher('selected', {
						selected: matches[selectedIndex!],
						method: 'traversal'
					})
				}
			}
		}
	}

	function findMatches(key?: string): string[] {
		let potentialMatches: string[] = listOptions.items

		if (listOptions.omit != undefined) {
			listOptions.omit.forEach((element) => {
			// Presuming that items are unique
				let potentialOmitIndex = potentialMatches.indexOf(element)
				if (potentialOmitIndex > -1) {
					potentialMatches.splice(potentialOmitIndex, 1)
				}
			})
		}

		if (listOptions.filter != undefined) {
			potentialMatches = listOptions.filter.func(key || listOptions.filter.key, potentialMatches)
		}
		selectedIndex = undefined
		return potentialMatches
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
				text-left 
				text-black
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
			on:click={() => itemSelected(match)}
			on:mouseenter={() => (selectedIndex = index)}
			class={`cursor-pointer hover:bg-gray-200 px-3 py-2 ${
				selectedIndex == index ? 'bg-gray-100' : ''
			}`}
		>
			<slot listItemString={match}>
				{match}
			</slot>
		</li>
	{/each}
</ul>
