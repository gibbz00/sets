<script lang="ts">
	/*
        Description:
            Uses a HiddenSelectableInput that is revealed by pressing the edit item of a menu that is itself Hidden
            Menu is of absolute positioning
			Support setting the ellipsis positioning to absolute
				Useful for the casees when centering should be done i relative the placeholder only
    */

	import HiddenSelectableInput from './HiddenSelectableInput.svelte'
	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import PopMenu from './PopMenu.svelte'
	import type { SvelteComponentTyped } from 'svelte'

	let cls: string = "";
	export {cls as class};
	export let inputPlaceholderText: string = ''
	export let dynamicWidth: boolean = false
	export let absoluteEllipsisPositioning: boolean = true
	export let inputElementClasses: (HiddenSelectableInput extends SvelteComponentTyped<infer Prop>
		? Prop
		: never)['elementClasses'] = {}
	export let iconClass: (PopMenu extends SvelteComponentTyped<infer Prop>
		? Prop
		: never)['iconClass'] = {}
	export let fadeTransition: boolean = false

	let updateDispatcher: (type: 'update', detail: string) => boolean =
		createEventDispatcher()
	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()

	onMount(() => {
		if ($$slots.placeholderContent == undefined) {
			console.warn('EllipsisMenu created without the placeholderContent slot')
		}
	})

	// TODO: hidden = true might not be needed since the item itself is removed
	let popMenuOpened: boolean
	function deleteHandler() {
		deleteDispatcher('delete')
		popMenuOpened = false
	}
</script>

<HiddenSelectableInput
	on:selected={(event) => updateDispatcher('update', event.detail.selected)}
	placeholderText={inputPlaceholderText}
	elementClasses={inputElementClasses}
	{dynamicWidth}
	{fadeTransition}
	class={cls}
>
	<!-- stopPropagation because of the nested Hidden component -->
	<div on:click|stopPropagation slot="placeholderContent" class="flex content-center min-w-max">
		<slot name="placeholderContent" />
		<div class="relative">
			<div
				class={`${
					absoluteEllipsisPositioning ? 'absolute left-full inset-y-0' : ''
				} grid place-content-center`}
			>
				<PopMenu opened={popMenuOpened} iconType="more_vert" {iconClass}>
					<div
						slot="popMenuWindow"
						class="font-normal 
										text-black 
										bg-white 
										border-2 
										divide-y-2 
										rounded-sm 
										shadow-sm 
										border-gray-100
										divide-slate-100"
					>
						<button
							id="revealTarget"
							class="w-full px-1 py-1 text-left hover:bg-slate-100"
						>
							Edit
						</button>
						<button
							class="w-full px-1 py-1 text-left hover:bg-slate-100"
							on:click={deleteHandler}
						>
							Remove
						</button>
					</div>
				</PopMenu>
			</div>
		</div>
	</div>
</HiddenSelectableInput>
