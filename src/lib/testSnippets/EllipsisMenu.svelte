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
	import DropMenu from './DropMenu.svelte'

	export let inputPlaceholderText: string = ''
	export let dynamicWidth: boolean = false
	export let absoluteEllipsisPositioning: boolean = true

	let updateDispatcher: (type: 'update', textFieldValue: string) => boolean =
		createEventDispatcher()
	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()

	onMount(() => {
		if ($$slots.placeholderContent == undefined) {
			console.warn('EllipsisMenu created without the placeholderContent slot')
		}
	})

	// TODO: hidden = true might not be needed since the item itself is removed
	// If that is the case, then I probably don't need this component at all
	let hidden: boolean
	function deleteHandler() {
		deleteDispatcher('delete')
		hidden = true
	}
</script>

<HiddenSelectableInput
	on:selected={(event) => updateDispatcher('update', event.detail)}
	placeholderText={inputPlaceholderText}
	{dynamicWidth}
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
				<DropMenu iconType="more_vert">
					<div
						slot="dropMenuWindow"
						class="font-normal 
										text-black 
										bg-white 
										border-2 
										divide-y-2 
										rounded-sm 
										shadow-sm 
										border-gray 
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
				</DropMenu>
			</div>
		</div>
	</div>
</HiddenSelectableInput>
