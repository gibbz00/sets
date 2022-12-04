<script lang="ts">
	import SelectableInput from "$lib/SelectableInput.svelte"
	import type Icon from "$lib/Icon.svelte"
    import type { SelectedEvent, SelectedEventDetail } from "$lib/utils/TypeStub";
	import { beforeUpdate, createEventDispatcher, SvelteComponentTyped } from "svelte"
	import { fade, type FadeParams } from 'svelte/transition'
	import {
		fadeInDelay,
		fadeInDuration,
		fadeOutDelay,
		fadeOutDuration,
	} from '$lib/transitionConstants'
	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'

    /*
        * Makes use of SelectableInput with defaults set in a way to mimic the HTMLSelectElement 
        * Slot props allow the options to include html components/elements.
    	* Icon of choice next to placeholderContent with iconType prop
        * Default icon styling includes rotation
        * Clicking outisde of menu hides it
		* Pressing escape hides menu (double tap if input is active)
        * Option to allow entries not present in list
    */
    export let disallowNonOptionSelection: boolean = true
    type SelectableInputProps = (SelectableInput extends SvelteComponentTyped<infer Props> ? Props : never)
    export let optionStringItems: SelectableInputProps['listItems'] = []
	export let optionStringFilter: SelectableInputProps['listFilter'] = autocompleteFilter
	export let placeholderText: SelectableInputProps['placeholderText']
	let selectedDispatcher: SelectedEvent = createEventDispatcher()
    let elementClasses: SelectableInputProps['elementClasses'] = {
        input: 'p-2',
		icon: ''
    }
    function handleSelected(detail: SelectedEventDetail) {
        if (disallowNonOptionSelection && !optionStringItems!.includes(detail.selected)) {
            throw new Error(`disallowNonOptionSelection: ${detail.selected} not present in option list`)
        }
        if (detail.method == 'selection') {
            opened = false
            renderIcon()
        }
        selectedDispatcher('selected', detail)
    }

    export let opened: boolean = false

	export let fadeTransition: boolean = false
	function emptyTransition(node: Element, emptyParameter: FadeParams): Object {
		return {}
	}
	let chosenTransition = fadeTransition ? fade : emptyTransition

	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type'] = 'expand_more'
	type IconState = {
		base?: string
		opened?: string
		enabled?: string
		disabled?: string
		groupHover?: `group-hover:${string}`
	}
	export let iconClass: IconState = {}
    export let defaultIconClass: IconState = {
		base: 'fill-gray-400 w-8 transition',
		opened: '-rotate-90',
		enabled: 'fill-black',
		disabled: 'fill-gray-400',
		groupHover: 'group-hover:fill-black',
	}
    // Merge user-supplied props with defaults
    // Do not include default if user supplies his own icon fills
	Object.keys(defaultIconClass).forEach((value) => {
		let key: keyof IconState = value as any
		if (iconClass[key] == undefined) {
            iconClass[key] = defaultIconClass[key] as IconState['groupHover']
		} else {
			if (iconClass[key]!.includes('fill-')) return

			if (key != 'groupHover') {
				iconClass[key] = `${defaultIconClass[key]} ${iconClass[key]}`
			}
		}
	})

	let overPopMenu: boolean = false
	let thisComponent: HTMLDivElement
    renderIcon()
	beforeUpdate(() => {
        renderIcon()
	})

	function renderIcon() {
        let classString: string = `${iconClass.base} ${iconClass.groupHover}`
        if (opened) classString += ` ${iconClass.opened}`
        if (overPopMenu) classString += ` ${iconClass.enabled}`
        else classString += ` ${iconClass.disabled}`
        elementClasses!.icon = classString
	}

	function checkOpenToggle(event: MouseEvent) {
		if (!opened && thisComponent.contains(event.target as Node)) {
            opened = true
			return
		}

		if (opened) {
			if (!thisComponent.contains(event.target as Node)) {
				opened = false
			}
		}
	}

	function checkClose(event: KeyboardEvent) {
		if (opened == true && event.key == 'Escape') {
			opened = false
		}
	}

</script>

<!-- Capture here in case component or component child was removed further down the event stack -->
<svelte:window
	on:click|capture={(event) => checkOpenToggle(event)}
	on:keydown|capture={(event) => checkClose(event)}
/>
<div
    bind:this={thisComponent}
    class="group rounded-md hover:bg-zinc-300/20"
    on:mouseenter={() => {overPopMenu = true; renderIcon()}}
    on:mouseleave={() => {overPopMenu = false; renderIcon()}}
	in:chosenTransition|local={{
		delay: fadeInDelay,
		duration: fadeInDuration,
	}}
	out:chosenTransition|local={{
		delay: fadeOutDelay,
		duration: fadeOutDuration,
	}}
>
    <SelectableInput
        {placeholderText}
        {elementClasses}
        {iconType}
        itemsShown={opened}
        resetInputUponSelect={false}
        instantSelection={true}
        itemsInitiallyHidden={false}
        selectOnTraverse={true}
        listItems={optionStringItems}
        listFilter={optionStringFilter}
        on:selected={(event) => handleSelected(event.detail)}
        let:listItemString={option}
    >
        <slot {option}>
            {option}
        </slot>
    </SelectableInput>
</div>
