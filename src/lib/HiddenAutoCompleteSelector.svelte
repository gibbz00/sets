<script lang="ts">
	/*
        Description:
            * Selection:
                * Pressing enter on non-empty input
                * Clicking shown list
                * Arrow up or down and pressing enter on selected list item
            * Cancelation:
                * Methods
                    * Pressing escape 
                    * Clicking outside of input
                    * Enterering a empty input 
            * Both selection and cancelation reset UI to initial state
            * Autoselect option
                * Case-sensitive whole pattern matching starting only at first index  
                * Pressing down arrow before any input shows all options
                * Input changes filter the list automatically
                    * Reverting back to empty input shows all options
            * No autoselect option
                * Up and down arrows do nothing
                * No list is shown
    */

	import { createEventDispatcher } from 'svelte'
	import { inputWidthAutoResize } from '$lib/Actions/InputWidthAutoResize'
	import { preserveInputPlaceholderHeight } from '$lib/Actions/PreserveInputPlaceholderHeight'
	import { offsetFromInput } from '$lib/Actions/OffsetFromInput'

	// data - array of matches to compare input with
	export let data: element[] = []
	export let placeholder: string = ''
	export let inputStyling: string = ''
	export let preserveHeight: boolean = true
	export let dynamicInputWidth: boolean = true

	// Detail should be input value
	// TODO: use typesetting to program this in
	const dispatch: (type: 'selected' | 'input', detail?: string) => boolean =
		createEventDispatcher()

	// Flexibilty for feature extention of wht data-types the component can handle
	type element = string

	let hidden: boolean = true

	// Text-area live value
	let input = ''
	// Array of objects that match the input
	let remaining: element[] = []

	let textField: HTMLInputElement
	// TODO: typeset to whole numbers greater than -1 and always less than remaining.length
	// -1 symbolises unset
	let selectedIndex: number = -1

	function filterData() {
		if (input.length == 0) {
			remaining = data
		} else {
			let tempRemaining = data
			for (let index = 0; index < input.length; index++) {
				tempRemaining = tempRemaining.filter((element) => {
					if (element.charAt(index) == input.charAt(index)) {
						return element
					}
				})
			}
			remaining = tempRemaining
		}
	}

	// BUG: svelte bug: can't use "as" keyword in anonymous callback functions witten outside of script tag
	function filterDataPrepare(event: Event) {
		input = (event.target as HTMLInputElement).value
		filterData()
	}

	function handleInput(event: InputEvent) {
		if (event.inputType == 'deleteWordBackward' || 'deleteContentBackward') {
			selectedIndex = -1
		} else {
			filterDataPrepare(event)
		}
	}

	// ArrowUp and Arrowdown should not be listened to globally, only from input
	function checkSubmit(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				console.log(input)
				if (input != '') {
					console.log('rans')
					dispatch('selected', input)
					resetUI()
				}
				break
			case 'Escape':
				resetUI()
				break
			case 'ArrowUp':
				if (selectedIndex > 0) {
					input = remaining[--selectedIndex]
					setTimeout(() => textField.dispatchEvent(new Event('input')), 40)
				}
				break
			// TODO: fix setTimeouts
			case 'ArrowDown':
				// Do not attemp to select list item if input has been entered and there is no match,
				// or when there is no data to be matched against
				if ((input.length > 0 && remaining.length == 0) || data.length == 0) {
					return
				}
				// Show all list items without having to type anything
				else if (selectedIndex == -1) {
					filterData()
					selectedIndex = 0
					input = remaining[selectedIndex]
					setTimeout(() => textField.dispatchEvent(new Event('input')), 40)
				} else if (selectedIndex < remaining.length - 1) {
					input = remaining[++selectedIndex]
					setTimeout(() => textField.dispatchEvent(new Event('input')), 40)
				}
				break
		}
		console.log(selectedIndex, remaining[selectedIndex])
	}

	function resetUI() {
		hidden = true
		input = ''
		remaining = []
	}

	function unHide() {
		hidden = false
	}
</script>

<!-- Keydown listened on window so that there isn't a requirement for the input to be focused -->
<svelte:window
	on:click|capture={(event) => {
		if (!hidden && event.target != textField) {
			resetUI()
		}
	}}
	on:keyup={(event) => {
		if (!hidden) checkSubmit(event)
	}}
/>

<!--
	class="hidden" used instead of svelte if blocks so that input height can be calculated on mount, 
	it has to be known before shown to the user
-->
<div class="contents" use:preserveInputPlaceholderHeight={preserveHeight}>
	<div class={`${hidden ? '' : 'hidden'} `} on:click={() => unHide()}>
		<slot name="placeholder">
			<button class="text-2xl rounded-full hover:bg-gray-200 w-8 h-full"> + </button>
		</slot>
	</div>

	<div class={`relative border-2 border-purple-500 ${hidden ? 'hidden' : ''} w-min`}>
		<!-- bind:input not used since eventlistener is fired first anyway, creates a bug in all the data is shown before any input has been made -->
		<input
			bind:this={textField}
			on:beforeinput={(event) => handleInput(event)}
			type="text"
			autocomplete="off"
			{placeholder}
			value={input}
			use:inputWidthAutoResize={dynamicInputWidth}
			class={`px-2 my-auto ${inputStyling}`}
		/>
		{#if remaining.length > 0}
			<!-- Top offset calculated from action -->
			<ul
				use:offsetFromInput
				on:click|stopPropagation={() => {}}
				class="absolute z-10 inset-x-0 min-w-max text-left bg-white border-2 divide-y-2 rounded-sm shadow-sm border-gray divide-slate-100"
			>
				{#each remaining as element, index (element)}
					<li
						class={`${index == selectedIndex ? 'bg-gray-100' : ''} px-3 py-2`}
						on:click={() => {
							dispatch('selected', element)
							resetUI()
						}}
					>
						{element}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
