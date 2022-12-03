<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import InteractiveList from '$lib/InteractiveList.svelte'

	/*
		Selection:
        * Clickable arrow beside input element for mouse/tap driven users
		* Keyboard driven selection by pressing enter key
		* Selection resets textfield by default, optionally turned off
        * Option to add a selectable list
			* See InterActiveList.svelte for more info on behaviour
		* Optionally set list selction to trigger immediate event forwarding
			* Feature not needed when there is no use in editing list selection 
        * Option to have automatic width based on current input,
    */

	import { afterUpdate, createEventDispatcher, onMount, SvelteComponentTyped } from 'svelte'
	import { getInputWidthInPixels } from './utils/dynamicInputWidth'
	import type { FilterFunction, SelectedEvent, SelectedEventDetail } from './utils/TypeStub';

	export let placeholderText: string = ''
	export let autofocus: boolean = false
	export let dynamicWidth: boolean = false
	export let itemsInitiallyHidden: boolean = true
	export let resetInputUponSelect: boolean = true
	export let selectUponClick: boolean = false
	export let selectOnTraverse: boolean = false
	export let itemsShown: boolean | undefined = undefined

	type ElementClasses = {
		input?: string
		icon?: string
		list?: string
	}
	export let elementClasses: ElementClasses = {
		input: "w-full"
	}
	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type'] = "arrowRightAlt"


	export let listItems: string[] = []
	export let listOmit: string[] | undefined = undefined
	export let listFilter: undefined | FilterFunction = undefined

	let textFieldValue: string = ''
	let listOptions: (InteractiveList extends SvelteComponentTyped<infer Props> ? Props : never)['listOptions']
	let listFilterKey: string = textFieldValue
	$: listOptions = {
			items: listItems,
			omit: listOmit,
			filter: listFilter != undefined ?  { key: listFilterKey, func: listFilter } : undefined
	}

	let input: HTMLInputElement
	let selectedDispatcher: SelectedEvent = createEventDispatcher()
	let activatedInteractiveList: boolean = false

	let inputContainer: HTMLDivElement
	let listWrapper: HTMLDivElement
	// TODO: Remove?
	// List is rendered absolute and must be offset relative to the dynamic inputHeight
	onMount(() => {
		listWrapper.style.top = `${inputContainer.getBoundingClientRect().height}px`
	})

	afterUpdate(() => {
		if (dynamicWidth && input != null) {
			input.style.width = getInputWidthInPixels(input)
		}
	})

	function listItemSelected(detail: SelectedEventDetail) {
		textFieldValue = detail.selected
		if (detail.method == 'selection') activatedInteractiveList = false
		if (selectUponClick) selectHandler(detail.method)
	}

	function selectHandler(method: SelectedEventDetail['method']) {
		if (textFieldValue != '') {
			selectedDispatcher('selected', {
				selected: textFieldValue,
				method
			})
			if (resetInputUponSelect) {
				textFieldValue = ''
			}
		}
	}

	function keyEventHandler(event: KeyboardEvent) {
		let key: KeyboardEvent['key'] = event.key
		if (key == "Enter") {
			selectHandler('selection') 
			input.blur()
		} 
		else if (key == "ArrowDown" || key == "ArrowUp") activatedInteractiveList = true
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
			class={`w-full bg-inherit focus-visible:outline-none ${elementClasses.input}`}
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
				selectHandler('selection')
			}}
			class="max-w-min"
		>
			<Icon class={elementClasses.icon} type={iconType}/>
		</button>
	</div>
	<div class="absolute inset-x-0" bind:this={listWrapper}>
		<InteractiveList
			{selectOnTraverse}
			{itemsInitiallyHidden}
			{itemsShown}
			{listOptions}
			class={elementClasses.list}
			keyHandlingActivated={activatedInteractiveList}
			on:selected={(event) => listItemSelected(event.detail.selected)}
			let:listItemString={listItemString}
		>
			<slot {listItemString}>
				{listItemString}
			</slot>
		</InteractiveList>
	</div>
</div>
