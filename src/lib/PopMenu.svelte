<script lang="ts">
	import Icon from './Icon.svelte'
	import { onMount } from 'svelte'
	import { beforeUpdate, SvelteComponentTyped } from 'svelte'
	import { fade, type FadeParams } from 'svelte/transition'
	import {
		fadeInDelay,
		fadeInDuration,
		fadeOutDelay,
		fadeOutDuration,
	} from './transitionConstants'

	/*
		Pop-menu a generalisation for drop menus.

        In component use:
            placeholderContent is wrapped in a div where max-w-sm and truncate is defined
		
		Description:

		* Menu is opened on mouse location
		* Icon of choice next to placeholderContent with iconType prop
        * Pressing inside popRightContainer opens menu
        * Clicking outisde of menu hides it
		* Pressing escape hides menu

        Icon fill color is gray by default but based on the following states:
            * popRightContainer hove
                from gray to black
            * mouseover opened menu
                gray if inside menu, black if outside of menu
			
		Icon class can also be supplied classes for the following states:
			default
			opened
			enabled
			disabled
        
    */
	let cls: string = ''
	export {cls as class}

	export let opened: boolean = false
	export let menuPosition: 'below' | 'over-mouse' = 'over-mouse'

	export let fadeTransition: boolean = false
	function emptyTransition(node: Element, emptyParameter: FadeParams): Object {
		return {}
	}
	let chosenTransition = fadeTransition ? fade : emptyTransition

	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type'] = 'expand_more'
	type IconState = {
		base?: string
		opened?: string
		groupHover?: `group-hover:${string}`
	}

	let iconClassString = ''
	let iconClassDefaults: IconState = {
		base: 'w-8 transition fill-gray-400',
		opened: '-rotate-90',
		groupHover: 'group-hover:fill-black',
	}
	export let iconClass: IconState = {}
    // Merge user-supplied props with defaults
    // Do not include default if user supplies his own icon fills
	Object.keys(iconClassDefaults).forEach((key: keyof IconState) => {
		if (iconClass[key] == undefined) {
			// @ts-ignore
			// A okay as the keys are the same and the object are of the same type
			iconClass[key] = iconClassDefaults[key]
		}
		else {
			if (iconClass[key]!.includes('fill-')) {
				const fillRegex: RegExp = /(group-hover:)?fill-[a-z]*(-[0-9]*)?(\/[0-9]*)?/
				// @ts-ignore
				iconClassDefaults[key] = iconClassDefaults[key].replace(fillRegex, '')
			}
			iconClass[key] + ' ' + iconClassDefaults[key]
		}
	})
	let overPopMenu: boolean = false
	let thisComponent: HTMLDivElement
	renderIcon()
	beforeUpdate(() => {
		renderIcon()
	})

	onMount(() => {
		if (!$$slots.popMenuWindow) {
			throw new Error('No menu window supplied to PopMenu.svelte')
		}
	})

	function renderIcon() {
        let classString: string = `${iconClass.base} ${iconClass.groupHover}`
        if (opened) classString += ` ${iconClass.opened}`
    	iconClassString = classString
	}

	let absoluteOffset = {
		offsetX: 0,
		offsetY: 0
	}
	function checkOpenToggle(event: MouseEvent) {
		if (!opened && thisComponent.contains(event.target as Node)) {

			if (menuPosition == 'over-mouse') {
				absoluteOffset = {
					// "polyfill" for the layerX and layerY shitshow
					offsetX: event.clientX - thisComponent.getBoundingClientRect().x,
					offsetY: event.clientY - thisComponent.getBoundingClientRect().y
				}
			}
			opened = true
			return
		}

		if (opened && !thisComponent.contains(event.target as Node)) {
			opened = false
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
	class={`relative min-w-max flex group rounded-full hover:bg-zinc-300/20 ${cls}`}
	on:mouseenter={() => (overPopMenu = true)}
	on:mouseleave={() => (overPopMenu = false)}
	in:chosenTransition|local={{
		delay: fadeInDelay,
		duration: fadeInDuration,
	}}
	out:chosenTransition|local={{
		delay: fadeOutDelay,
		duration: fadeOutDuration,
	}}
>
		<div class="grow">
			<slot name="placeholderContent" />
		</div>
		<Icon type={iconType} class={iconClassString} />
		{#if opened}
			<div
				class={`absolute ${menuPosition == 'below' ? 'inset-x-0 top-[100%]' : ''} z-10`}
				style:top={`${menuPosition == 'over-mouse' ? absoluteOffset.offsetY : ''}px`}
				style:left={`${menuPosition == 'over-mouse' ? absoluteOffset.offsetX : ''}px`}
			>
				<slot name="popMenuWindow" />
			</div>
		{/if}
</div>
