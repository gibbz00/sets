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
				* Pressing down arrow before any input shows all options (TODO)
				* They're otherwise just shown after the first first input event, since the input event triggers the filter function
				* Reverting back to empty input shows all options
			* List to textFieldValue
				* Does not trigger selection immediatedly, 
					* User might want to edit text before selecting (submitting)
				Done by:
					* Clicking on list-item 
					* Arrow up or down and pressing enter 
				* Selection clear list? (should be done automatically)

		TODO:
        * Option to have automatic width based on current input,
            see InputWidthAutoResize.ts action
        * Option to set input to be of absolute positioning,
            see CenterToParent.ts action

        Tests:
            * Selected event can be dispatches by
                 * Pressing enter (done)
                * Clicking arrow icon (done)
            * Selected event can be are heard by parent component (done)
    */

	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import Icon from '$lib/Icon.svelte'

	export let placeholderText: string = ''
	export let listItems: string[] = []
	// Defealt filter is to show every list item
	export let listFilter: (
		textFieldValue: string,
		items: typeof listItems
	) => typeof listItems = () => listItems
	export let autofocus: boolean = false

	let textFieldValue: string = ''
	let listMatches: string[] = []
	let selectedDispatcher: (type: 'selected', textFieldValue: string) => boolean =
		createEventDispatcher()
	let canceledDispatcher: (type: 'canceled') => boolean = createEventDispatcher()

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

	/* 
		TODO: Would be nice to have integer types 
			Possible solutions:
				* Uint16Array with only one element
				* BigInt
				* Typescript type using modulo == 0
	*/
	let selectedListItemIndex: number | undefined = 0

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				selectHandler()
				break
			case 'ArrowDown':
				if (textFieldValue == '') findListMatches()
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
		listMatches = listFilter(textFieldValue, listItems)
	}
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
