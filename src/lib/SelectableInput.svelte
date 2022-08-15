<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import InteractiveList from './InteractiveList.svelte'

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

	import { afterUpdate, createEventDispatcher, onMount, SvelteComponentTyped } from 'svelte'
	import { getInputWidthInPixels } from './utils/dynamicInputWidth'

	export let placeholderText: string = ''
	export let listItems: (InteractiveList extends SvelteComponentTyped<infer Props>
		? Props
		: never)['listItems'] = []
	export let listFilter: (InteractiveList extends SvelteComponentTyped<infer Props>
		? Props
		: never)['listFilter'] = undefined

	export let autofocus: boolean = false
	export let dynamicWidth: boolean = false
	type ElementClasses = {
		input?: string
		icon?: string
		list?: string
	}
	export let elementClasses: ElementClasses = {}

	let textFieldValue: string = ''
	let input: HTMLInputElement
	let selectedDispatcher: (type: 'selected', textFieldValue: string) => boolean =
		createEventDispatcher()
	let activatedInteractiveList: boolean = false
	let listFilterKey: string = textFieldValue

	// List is rendered absolute and must be offset relative to the dynamic inputHeight
	let inputContainer: HTMLDivElement
	let listWrapper: HTMLDivElement
	onMount(() => {
		listWrapper.style.top = `${inputContainer.getBoundingClientRect().height}px`
	})

	afterUpdate(() => {
		if (dynamicWidth && input != null) {
			input.style.width = getInputWidthInPixels(input)
		}
	})

	function listItemSelected(listItem: string) {
		textFieldValue = listItem
		activatedInteractiveList = false
	}

	// Empty selections are regarded as invalid
	function selectHandler() {
		if (textFieldValue != '') {
			selectedDispatcher('selected', textFieldValue)
			textFieldValue = ''
		}
	}

	// <!-- TODO: for interactivally showing list on down arrow: list items to undefined at first and then defined on ArrowDown, same goes for autocomplete indicator click -->
	function keyEventHandler(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				selectHandler()
				break
			default:
				activatedInteractiveList = true
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
			on:keydown={(event) => keyEventHandler(event)}
			bind:value={textFieldValue}
			on:input={() => (listFilterKey = textFieldValue)}
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
	<div bind:this={listWrapper}>
		<InteractiveList
			on:selected={(event) => listItemSelected(event.detail)}
			keyHandlingActivated={activatedInteractiveList}
			{listItems}
			{listFilter}
			filterKey={listFilterKey}
		/>
		<!-- class="absolute z-10 inset-x-0" -->
	</div>
</div>
