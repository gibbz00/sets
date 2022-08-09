<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import type { SvelteComponentTyped } from 'svelte'

	/*
        In component use:
            placeholderContent is wrapped in a div where max-w-sm and truncate is defined
		
		Description:

		* Icon of choice next to placeholderContent with iconType prop
        * Pressing inside dropRightContainer opens menu
        * Clicking outisde of menu hides it
		* Pressing escape hides menu

        Icon fill color is gray by default but based on the following states:
            * dropRightContainer hove
                from gray to black
            * mouseover opened menu
                gray if inside menu, black if outside of menu
			
		

        TODO:
        change gray and black to exported props enabled, disabled
            // use in Exercise info window
        
        Throws error if dropRightSlot isn't defined
    */
	export let iconClass: string = ''
	export let iconClassForOpened: string = ''
	// https://stackoverflow.com/questions/70103438/typescript-get-svelte-components-prop-type
	export let iconType: (Icon extends SvelteComponentTyped<infer Props> ? Props : never)['type']

	let opened: boolean = false
	let dropRightWindow: HTMLDivElement
	let dropRightContainer: HTMLDivElement

	function checkOpenToggle(event: MouseEvent) {
		if (!opened && dropRightContainer.contains(event.target as Node)) {
			opened = true
			return
		}

		if (opened) {
			if (!dropRightWindow.contains(event.target as Node)) {
				opened = false
			}
		}
	}

	function checkClose(event: KeyboardEvent) {
		if (opened == true && event.key == 'Escape') {
			opened = false
		}
	}

	let overDropRight: boolean = false
</script>

<!-- Capture since component might have been removed further down the event stack -->
<svelte:window
	on:click|capture={(event) => checkOpenToggle(event)}
	on:keydown={(event) => checkClose(event)}
/>

<!-- hover outside dropRightWindow when opneded should fill icon black -->
<div bind:this={dropRightContainer} class="flex relative max-w-max">
	<div class="contents group">
		<slot name="placeholderContent" />
		<Icon
			type={iconType}
			class={`
                    w-8 h-8 group-hover:fill-black 
                    ${iconClass}
                    ${
						opened
							? `${iconClassForOpened} ${
									overDropRight ? 'fill-gray-400' : 'fill-black'
							  }`
							: 'fill-gray-400'
					}
                `}
		/>
	</div>
	{#if opened}
		<div
			on:mouseenter={() => (overDropRight = true)}
			on:mouseleave={() => (overDropRight = false)}
			bind:this={dropRightWindow}
			class="absolute top-1/2 left-[95%] z-10"
		>
			<slot name="dropRightWindow" />
		</div>
	{/if}
</div>
