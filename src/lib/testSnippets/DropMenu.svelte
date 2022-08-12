<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import type { SvelteComponentTyped } from 'svelte'
	import { onMount } from 'svelte'
	import { beforeUpdate } from 'svelte'

	/*
        In component use:
            placeholderContent is wrapped in a div where max-w-sm and truncate is defined
		
		Description:

		* Icon of choice next to placeholderContent with iconType prop
        * Pressing inside dropRightContainer opens menu
		* Menu is opened on mouse location
        * Clicking outisde of menu hides it
		* Pressing escape hides menu

        Icon fill color is gray by default but based on the following states:
            * dropRightContainer hove
                from gray to black
            * mouseover opened menu
                gray if inside menu, black if outside of menu
			
		Icon class can also be supplied classes for the following states:
			default
			opened
			enabled
			disabled
        
    */

	// https://stackoverflow.com/questions/70103438/typescript-get-svelte-components-prop-type
	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type']

	type IconClass = {
		default?: string
		opened?: string
		enabled?: string
		disabled?: string
		groupHover?: `group-hover:${string}`
	}
	export let iconClass: IconClass = {}

	let opened: boolean = false
	let overDropRight: boolean = false
	let dropMenuWindow: HTMLDivElement
	let dropRightContainer: HTMLDivElement

	type AbsoluteOffset = {
		offsetX: number
		offsetY: number
	}
	let absoluteOffset: AbsoluteOffset

	let defaultIconClass: IconClass = {
		default: '',
		opened: '',
		enabled: 'fill-black',
		disabled: 'fill-gray-400',
		groupHover: 'group-hover:fill-black',
	}
	Object.keys(defaultIconClass).forEach((value) => {
		let key: keyof IconClass = value as any
		if (iconClass[key] == undefined) {
			// TODO: feels quite redundant
			if (key != 'groupHover') {
				iconClass[key] = defaultIconClass[key]
			} else iconClass[key] = defaultIconClass[key]
		} else {
			// do not add defaultIconClass if iconClass[key] contains 'fill-'
			// generally, any competing 	$: extracted = class in defaultIconClass
			if (iconClass[key] != undefined && iconClass[key]!.includes('fill-')) return

			if (key != 'groupHover') {
				iconClass[key] = `${defaultIconClass[key]} ${iconClass[key]}`
			}
		}
	})

	let iconClassString: string = buildIconString()

	onMount(() => {
		if (!$$slots.dropMenuWindow) {
			throw new Error('No menu window supplied to DropMenu.svelte')
		}
	})

	beforeUpdate(() => {
		iconClassString = buildIconString()
	})

	function buildIconString(): string {
		return `${iconClass.default} ${iconClass.groupHover} w-8 ${
			opened
				? `${overDropRight ? iconClass.disabled : iconClass.enabled} ${iconClass.opened}`
				: `${iconClass.disabled}`
		}`
	}

	function checkOpenToggle(event: MouseEvent) {
		if (!opened && dropRightContainer.contains(event.target as Node)) {
			openMenu(event)
			return
		}

		if (opened) {
			if (!dropMenuWindow.contains(event.target as Node)) {
				opened = false
			}
		}
	}

	function openMenu(event: MouseEvent) {
		// "polyfill" for the layerX and layerY shitshow
		let offsetX = event.clientX - dropRightContainer.getBoundingClientRect().x
		let offsetY = event.clientY - dropRightContainer.getBoundingClientRect().y
		absoluteOffset = {
			offsetX,
			offsetY,
		}
		opened = true
	}

	function checkClose(event: KeyboardEvent) {
		if (opened == true && event.key == 'Escape') {
			opened = false
		}
	}
</script>

<!-- Capture since component might have been removed further down the event stack -->
<svelte:window
	on:click|capture={(event) => checkOpenToggle(event)}
	on:keydown={(event) => checkClose(event)}
/>

<!-- hover outside dropMenuWindow when opneded should fill icon black -->
<div bind:this={dropRightContainer} class="relative max-w-max">
	<div class="flex group rounded-full hover:bg-zinc-300/20">
		{#if $$slots.placeholderContent}
			<div class="ml-3 my-1">
				<slot name="placeholderContent" />
			</div>
		{/if}
		<Icon type={iconType} class={iconClassString} />
	</div>
	{#if opened}
		<div
			on:mouseenter={() => (overDropRight = true)}
			on:mouseleave={() => (overDropRight = false)}
			bind:this={dropMenuWindow}
			class={`absolute z-10`}
			style:top={`${absoluteOffset.offsetY}px`}
			style:left={`${absoluteOffset.offsetX}px`}
		>
			<slot name="dropMenuWindow" />
		</div>
	{/if}
</div>
