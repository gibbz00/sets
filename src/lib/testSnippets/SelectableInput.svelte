<script lang="ts">
	/*
        Add a clickable arrow beside input element for mouse/tap driven users

        * Option to have automatic width based on current input,
            see InputWidthAutoResize.ts action
        * Option to set input to be of absolute positioning,
            see CenterToParent.ts action
        * Ability to pass down inputStyles as prop
        * Option to add a selectable list, used for things such as autocomplete
			* Selection of list item updates input value to item value
				* Done by:
					* Clicking on list-item 
					* Arrow up or down and pressing enter 
				* Selection clear list

        Tests:
            * Selected event can be dispatches by
                 * Pressing enter (done)
                * Clicking arrow icon (done)
            * Selected event can be are heard by parent component (done)
    */

	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import Icon from '$lib/Icon.svelte'
	import type { SelectedEvent } from './Events'

	export let textFieldValue: string = ''
	export let placeholderText: string = ''
	export let listItems: string[] = []

	let selectedDispatcher: SelectedEvent = createEventDispatcher()

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
		listItems = []
	}

	/* 
		TODO: Would be nice to have integer types 
			Possible solutions:
				* Uint16Array with only one element
				* BigInt
				* Typescript type using modulo == 0
	*/
	let selectedListItemIndex: number | undefined = 0

	function handleKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				selectedDispatcher('selected', textFieldValue)
				break
		}
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
			class="focus-visible:outline-none"
			type="text"
			placeholder={placeholderText}
			bind:value={textFieldValue}
			on:input
			on:keyup={(event) => handleKeyUp(event)}
		/>
		<button
			on:click={() => {
				selectedDispatcher('selected', textFieldValue)
			}}
		>
			<Icon type="arrowRightAlt" />
		</button>
	</div>
	<!-- Conditional required since an empty ul still renders its borders -->
	{#if listItems.length > 0}
		<!-- TODO: add class: class={`${index == selectedIndex ? 'bg-gray-100' : ''} px-3 py-2`}  -->
		<!-- IMPROVEMENT?: Event listener might be added to just ul in order to avoid having one for each list-item -->
		<ul
			bind:this={list}
			class="
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
			"
		>
			{#each listItems as listItem, index}
				<li
					on:click={() => listItemSelected(listItem)}
					class={`cursor-pointer px-3 py-2 ${
						selectedListItemIndex == index ? 'bg-gray-100' : ''
					}`}
				>
					{listItem}
				</li>
			{/each}
		</ul>
	{/if}
</div>
