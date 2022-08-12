<script lang="ts">
	/*
        Add a clickable arrow beside input element for mouse/tap driven users

		* Selection
			* On input:
				* Pressing enter (done)
				* Clicking arrow icon (done)
		* Selection resets textfield (done)
		* Enterering a empty input sends a canceled event and not a selected event (done)
        * Option to add a selectable list, used for things such as autocomplete
			* List items is supplied by the data prop (done)
			* List items can be filterered with the filterFunction (done)
			* Showing list items
				* Pressing down arrow before any input shows all options (done)
				* They're otherwise just shown after the first first input event (done)
				* Reverting back to empty input shows all options (done)
			* List to textFieldValue does not trigger selection immediatedly (done)
					User might want to edit text before selecting (submitting)
				* Done by:
					* Clicking on list-item (done)
					* Arrow up or down (done)
        * Option to have automatic width based on current input,
    */

	import { afterUpdate, createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import Icon from '$lib/Icon.svelte'
	import { getInputWidthInPixels } from './dynamicInputWidth'

	export let placeholderText: string = ''
	export let listItems: string[] = []
	export let listFilter:
		| ((textFieldValue: string, items: typeof listItems) => typeof listItems)
		| undefined = undefined
	export let autofocus: boolean = false
	export let dynamicWidth: boolean = false

	let listMatches: string[] = []
	let textFieldValue: string = ''
	let selectedDispatcher: (type: 'selected', textFieldValue: string) => boolean =
		createEventDispatcher()
	let canceledDispatcher: (type: 'canceled') => boolean = createEventDispatcher()

	/* 
		TODO: Would be nice to have integer types 
			Possible solutions:
				* Uint16Array with only one element
				* BigInt
				* Typescript type using modulo == 0
	*/
	let selectedListItemIndex: number | undefined = undefined

	// List is rendered absolute and must be offset relative to the dynamic inputHeight
	let inputContainer: HTMLDivElement
	let list: HTMLUListElement
	onMount(() => {
		if (listItems.length > 0) {
			list.style.top = `${inputContainer.getBoundingClientRect().height}px`
		}
	})

	function listItemSelected(listItem: string) {
		textFieldValue = listItem
		listMatches = []
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter') selectHandler()
		else if (listItems.length > 0 || listFilter != undefined) {
			switch (event.key) {
				case 'ArrowDown':
					if (selectedListItemIndex == undefined) {
						if (listMatches.length > 0) {
							selectedListItemIndex = 0
							textFieldValue = listMatches[selectedListItemIndex]
						} else findListMatches()
					} else if (selectedListItemIndex + 1 != listMatches.length) {
						textFieldValue = listMatches[++selectedListItemIndex]
					}
					break
				case 'ArrowUp':
					// event.preventDefault() called to prevent cursor jump to input beginning
					event.preventDefault()
					if (selectedListItemIndex != undefined && selectedListItemIndex > 0) {
						textFieldValue = listMatches[--selectedListItemIndex]
					}
					break
			}
		}
	}

	// Empty selections are regarded as invalid
	function selectHandler() {
		if (textFieldValue != '') {
			selectedDispatcher('selected', textFieldValue)
			textFieldValue = ''
		} else {
			canceledDispatcher('canceled')
		}
	}

	function findListMatches() {
		if (listFilter != undefined) {
			listMatches = listFilter(textFieldValue, listItems)
		} else if (listItems.length > 0) listMatches = listItems
		selectedListItemIndex = undefined
	}

	let input: HTMLInputElement
	afterUpdate(() => {
		// Null scenario can occur when component is destroyed
		// Throws error unless checked for
		if (dynamicWidth && input != null) {
			input.style.width = getInputWidthInPixels(input)
		}
	})
</script>

<div bind:this={inputContainer} class="relative w-min">
	<div
		class="
            w-max
            flex
            border-2
            border-gray-500/20
            focus-within:border-blue-500
        "
	>
		<!--
            ORDER MATTERS!!!
                * bind:value must come before on:input
                    * otherwise on:input will use old value
        -->
		<input
			class="ml-2 focus-visible:outline-none"
			type="text"
			{autofocus}
			placeholder={placeholderText}
			bind:value={textFieldValue}
			bind:this={input}
			on:input={findListMatches}
			on:keydown={(event) => handleKeyDown(event)}
		/>
		<button
			on:click={() => {
				selectHandler()
			}}
		>
			<Icon type="arrowRightAlt" />
		</button>
	</div>
	<!-- Conditional required since an empty ul still renders its borders -->
	<!-- IMPROVEMENT?: Event listener might be added to just ul in order to avoid having one for each list-item -->
	<ul
		bind:this={list}
		class={`
				${listMatches.length == 0 ? 'hidden' : ''}
				absolute
				z-10
				inset-x-0 
				min-w-max 
				text-left 
				bg-white 
				border-2 
				rounded-sm 
				shadow-sm 
				border-gray 
				divide-y-2 
				divide-slate-100
			`}
	>
		{#each listMatches as match, index}
			<li
				on:click={() => listItemSelected(match)}
				class={`cursor-pointer hover:bg-gray-200 px-3 py-2 ${
					selectedListItemIndex == index ? 'bg-gray-100' : ''
				}`}
			>
				{match}
			</li>
		{/each}
	</ul>
</div>
