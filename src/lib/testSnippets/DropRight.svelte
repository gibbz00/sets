<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import { afterUpdate } from 'svelte'
	import { beforeUpdate } from 'svelte'

	/*
        In component use:
            placeholderContent is wrapped in a div where max-w-sm and truncate is defined


        Has arrow next to placeholder content
        Pressing placeholder or arrow shows the dropright window next to the arrow
        Clicking outisde of dropright cancels operation 
        has an arrow 
            turned right when hidden
        turned left when not hidden
        turning is an transition

        should be closed with escape
        throws error if slots aren't defined
        uses opened state variable instead of focuss-withing to allow for toggling functionality

        (cancelable by pressing escape?)
            should not current hidden input, might need to add a stopp propagation there in selectable inpu
    */

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

	let overDropRight: boolean = false
</script>

<!-- Capture since component might have been removed further down the event stack -->
<svelte:window on:click|capture={(event) => checkOpenToggle(event)} />

<!-- hover outside dropRightWindow when opneded should fill icon black -->
<div bind:this={dropRightContainer} class="flex relative max-w-max">
	<div class="contents group">
		<slot name="placeholderContent" />
		<Icon
			type="arrowRight"
			class={`
                    w-8 h-8 group-hover:fill-black 
                    transition-transform 
                    ${
						opened
							? `rotate-180 ${overDropRight ? 'fill-gray-400' : 'fill-black'}`
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
