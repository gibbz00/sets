<script lang="ts">
	/*
        Description:
            Uses a HiddenSelectableInput that is revealed by pressing the edit item of a menu that is itself Hidden
    */

	import Icon from '$lib/Icon.svelte'
	import Hidden from './Hidden.svelte'
	import HiddenSelectableInput from './HiddenSelectableInput.svelte'
</script>

<HiddenSelectableInput>
	<!-- stopPropagation because there is a child Hidden component -->
	<div on:click|stopPropagation slot="placeholderContent" class="flex">
		<p>Test</p>
		<div>
			<Hidden>
				<svelte:fragment slot="placeholderContent">
					<Icon type="more_vert" />
				</svelte:fragment>
				<div
					slot="hiddenContent"
					class="
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
					<button class="w-full px-1 py-1 text-left hover:bg-slate-100"> Remove </button>
				</div>
			</Hidden>
		</div>
	</div>
</HiddenSelectableInput>
