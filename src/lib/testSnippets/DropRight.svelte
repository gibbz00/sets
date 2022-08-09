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

	let willUpdate: Promise<true>
	let doneUpdate: Promise<true>

	beforeUpdate(() => {
		if (opened) {
			console.log('huh')
			willUpdate = Promise.resolve(true)
		}
	})

	afterUpdate(() => {
		if (opened) {
			console.log('bik')
			doneUpdate = Promise.resolve(true)
		}
	})

	async function checkOpenToggle(event: MouseEvent) {
		if (!opened && dropRightContainer.contains(event.target as Node)) {
			opened = true
			return
		}

		// BUG: Contains can only run after droprightWindow has been updated,
		// it tried to without any timeout and throws a null error.

		// FIX:
		// Sets a max-limit for how long it will wait before closing
		// A limit that is hopefully longer than the time it takes to update
		// The limit would propably suffice; but this method allows the contains method to be runned earlier if possible
		if (opened) {
			willUpdate = new Promise(() => {})
			doneUpdate = new Promise(() => {})

			//what happens if dropRightWindow is target?
			// parent chech is required since clicked item might have dissapeared
			setTimeout(() => {
				if (!dropRightWindow.contains(event.target as Node)) {
					// This won't work since I don't know how many levels are removed
					// Thinking about creating a snapchot on function start and comparing it in this callback
					console.log(dropRightWindow.contains((event.target as Node).parentElement))
					opened = false
					console.log('rans')
				}
				return
			}, 200)

			await doneUpdate
			console.log('bok')
			if (!dropRightWindow.contains(event.target as Node)) opened = false
		}
	}
</script>

<svelte:window on:click={(event) => checkOpenToggle(event)} />

<div bind:this={dropRightContainer} class="group flex relative max-w-max">
	<slot name="placeholderContent" />
	<Icon
		type="arrowRight"
		class={`
                    fill-gray-400 w-8 h-8 group-hover:fill-black 
                    transition-transform ${opened ? 'rotate-180 fill-black' : ''}
                `}
	/>
	{#if opened}
		<div bind:this={dropRightWindow} class="absolute top-1/2 left-[95%] z-10">
			<slot name="dropRightWindow" />
		</div>
	{/if}
</div>
