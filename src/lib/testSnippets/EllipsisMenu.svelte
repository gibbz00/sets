<script lang="ts">
	/*
        Description:
            Uses a HiddenSelectableInput that is revealed by pressing the edit item of a menu that is itself Hidden
            Menu is of absolute positioning
    */

	import Icon from '$lib/Icon.svelte'
	import Hidden from './Hidden.svelte'
	import HiddenSelectableInput from './HiddenSelectableInput.svelte'
	import { createEventDispatcher } from 'svelte'

	export let inputPlaceholderText: string = ''
	export let dynamicWidth: boolean = false

	let updateDispatcher: (type: 'update', textFieldValue: string) => boolean =
		createEventDispatcher()
	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()
	let hidden: boolean

	// TODO: hidden = true might not be needed since the item itself is removed
	// If that is the case, then I probably don't need this component at all
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
	<div on:click|stopPropagation slot="placeholderContent" class="flex">
		<slot name="placeholderContent" />
		<div class="relative">
			<Hidden hidden>
				<svelte:fragment slot="placeholderContent">
					<Icon type="more_vert" />
				</svelte:fragment>
				<div
					slot="hiddenContent"
					class="
                        absolute
                        top-0
                        left-0
                        font-normal 
                        text-black 
                        bg-white 
                        border-2 
                        divide-y-2 
                        rounded-sm 
                        shadow-sm 
                        border-gray 
                        divide-slate-100 
                    "
				>
					<button id="revealTarget" class="w-full px-1 py-1 text-left hover:bg-slate-100">
						Edit
					</button>
					<button
						class="w-full px-1 py-1 text-left hover:bg-slate-100"
						on:click={deleteHandler}
					>
						Remove
					</button>
				</div>
			</Hidden>
		</div>
	</div>
</HiddenSelectableInput>
