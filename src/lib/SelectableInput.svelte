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

	import { afterUpdate, createEventDispatcher, SvelteComponentTyped } from 'svelte'
	import { getInputWidthInPixels } from './utils/dynamicInputWidth'
	import type { FilterFunction, SelectedEvent, SelectedEventDetail } from './utils/TypeStub';

	export let placeholderText: string = ''
	export let autofocus: boolean = false
	export let dynamicWidth: boolean = false
	export let itemsInitiallyHidden: boolean = true
	export let resetInputUponSelect: boolean = true
	export let instantSelection: boolean = false
	export let selectOnTraverse: boolean = true
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

	afterUpdate(() => {
		if (dynamicWidth && input != null) {
			input.style.width = getInputWidthInPixels(input)
		}
	})

	function listItemSelected(detail: SelectedEventDetail) {
		textFieldValue = detail.selected
		if (detail.method == 'selection') activatedInteractiveList = false
		if (instantSelection) selectHandler(detail.method)
		// Otherwise focus is remained on list, making it hard to
		// edit selection immediatedly without on the input again.
		else input.focus()
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
		<!-- svelte-ignore a11y-autofocus -->
		<!-- Input often revealed from a hidden element-->
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
	<div class="absolute inset-x-0 z-20">
		<InteractiveList
			{selectOnTraverse}
			{itemsInitiallyHidden}
			{itemsShown}
			{listOptions}
			class={elementClasses.list}
			keyHandlingActivated={activatedInteractiveList}
			on:selected={(event) => listItemSelected(event.detail)}
			let:listItemString={listItemString}
		>
			<slot {listItemString}>
				{listItemString}
			</slot>
		</InteractiveList>
	</div>
</div>
