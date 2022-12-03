<script lang="ts">
	import SelectableInput from "$lib/SelectableInput.svelte"
	import type Icon from "$lib/Icon.svelte"
	import { beforeUpdate, createEventDispatcher, SvelteComponentTyped } from "svelte"
    import type { SelectedEvent, SelectedEventDetail } from "$lib/utils/TypeStub";

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
	export let optionStringFilter: SelectableInputProps['listFilter']
	export let placeholderText: SelectableInputProps['placeholderText']

	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type'] = 'expand_more'
	type IconState = {
		default?: string
		opened?: string
		enabled?: string
		disabled?: string
		groupHover?: `group-hover:${string}`
	}
	export let iconClass: IconState = {}
    export let defaultIconClass: IconState = {
		default: 'fill-gray-400 w-8 transition',
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

    let itemsShown: boolean
	let mouseOverOptionsElement: boolean = false
	let optionElement: HTMLDivElement
    let elementClasses: SelectableInputProps['elementClasses'] = {
        input: 'p-2'
    }
    renderIcon()
	beforeUpdate(() => {
        renderIcon()
	})

	let selectedDispatcher: SelectedEvent = createEventDispatcher()


	function renderIcon() {
        let classString: string = `${iconClass.default} ${iconClass.groupHover}`
        if (itemsShown) classString += ` ${iconClass.opened}`
        if (mouseOverOptionsElement) classString += ` ${iconClass.enabled}`
        else classString += ` ${iconClass.disabled}`
        elementClasses!.icon = classString
	}

	function checkOpenToggle(event: MouseEvent) {
		if (!itemsShown && optionElement.contains(event.target as Node)) {
            itemsShown = true
			return
		}

		if (itemsShown) {
			if (!optionElement.contains(event.target as Node)) {
				itemsShown = false
			}
		}
	}

	function checkClose(event: KeyboardEvent) {
		if (itemsShown == true && event.key == 'Escape') {
			itemsShown = false
		}
	}

    function handleSelected(detail: SelectedEventDetail) {
        if (disallowNonOptionSelection && !optionStringItems!.includes(detail.selected)) {
            throw new Error(`disallowNonOptionSelection: ${detail.selected} not present in option list`)
        }
        if (detail.method == 'selection') {
            itemsShown = false
            renderIcon()
        }
        selectedDispatcher('selected', detail)
    }
</script>

<!-- Capture here in case component or component child was removed further down the event stack -->
<svelte:window
	on:click|capture={(event) => checkOpenToggle(event)}
	on:keydown|capture={(event) => checkClose(event)}
/>
<div
    on:mouseenter={() => {mouseOverOptionsElement = true; renderIcon()}}
    on:mouseleave={() => {mouseOverOptionsElement = false; renderIcon()}}
    bind:this={optionElement}
    class="group rounded-md hover:bg-zinc-300/20"
>
    <SelectableInput
        {placeholderText}
        {elementClasses}
        {iconType}
        {itemsShown}
        resetInputUponSelect={false}
        selectUponClick={true}
        itemsInitiallyHidden={true}
        selectOnTraverse={true}
        listItems={optionStringItems}
        listFilter={optionStringFilter}
        on:selected={(event) => handleSelected(event.detail.selected)}
        let:listItemString={option}
    >
        <slot {option}>
            {option}
        </slot>
    </SelectableInput>
</div>