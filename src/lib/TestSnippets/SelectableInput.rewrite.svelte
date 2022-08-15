<script lang="ts">
	import Icon from '$lib/Icon.svelte'

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
					* Arrow up on first index moved index to last.
        * Option to have automatic width based on current input,
    */

	import { afterUpdate, createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import { getInputWidthInPixels } from '$lib/utils/dynamicInputWidth'
	import InteractiveList from './InteractiveList.svelte'
	import type { SvelteComponentTyped } from 'svelte/types/runtime/internal/dev'

	export let placeholderText: string = ''
	export let listItems: (InteractiveList extends SvelteComponentTyped<infer Props>
		? Props
		: never)['listItems']
	export let listFilter: (InteractiveList extends SvelteComponentTyped<infer Props>
		? Props
		: never)['listFilter']

	export let autofocus: boolean = false
	export let dynamicWidth: boolean = false
	type ElementClasses = {
		input?: string
		icon?: string
		list?: string
	}
	export let elementClasses: ElementClasses = {}

	let textFieldValue: string = ''
	let selectedDispatcher: (type: 'selected', textFieldValue: string) => boolean =
		createEventDispatcher()
	let canceledDispatcher: (type: 'canceled') => boolean = createEventDispatcher()

	// List is rendered absolute and must be offset relative to the dynamic inputHeight
	let inputContainer: HTMLDivElement
	let list: InteractiveList
	onMount(() => {
		list.style.top = `${inputContainer.getBoundingClientRect().height}px`
	})

	let input: HTMLInputElement
	afterUpdate(() => {
		// Null scenario can occur when component is destroyed
		// Throws error unless checked for
		if (dynamicWidth && input != null) {
			input.style.width = getInputWidthInPixels(input)
		}
	})

	function listItemSelected(listItem: string) {
		textFieldValue = listItem
		listItems = []
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
</script>

<div bind:this={inputContainer} class="relative h-full">
	<div class="flex h-full">
		<!--
            ORDER MATTERS!!!
                * bind:value must come before on:input
                    * otherwise on:input will use old value
        -->
		<input
			class={`bg-inherit focus-visible:outline-none ${elementClasses.input}`}
			type="text"
			{autofocus}
			placeholder={placeholderText}
			bind:value={textFieldValue}
			bind:this={input}
		/>
		<button
			on:click={() => {
				selectHandler()
			}}
			class="max-w-min"
		>
			<Icon class={elementClasses.icon} type="arrowRightAlt" />
		</button>
	</div>
	<!-- TODO: for interactivally showing list on down arrow: list items to undefined at first and then defined on ArrowDown, same goes for autocomplete indicator click -->
	<InteractiveList
		on:selected={(event) => listItemSelected(event.detail)}
		{listItems}
		{listFilter}
		filterKey={textFieldValue}
		class="absolute z-10 inset-x-0"
	/>
</div>
