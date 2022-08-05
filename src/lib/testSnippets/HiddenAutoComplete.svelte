<script lang="ts">
	import AutoComplete from './AutoComplete.svelte'
	import HiddenSelectableInput from './HiddenSelectableInput.svelte'

	export let placeholderText: string = ''
	export let data: string[] = []
</script>

<HiddenSelectableInput>
	<button
		slot="placeholderContent"
		class="
				text-2xl 
				rounded-full 
				hover:bg-gray-200 
				w-8 
				h-full
			"
	>
		+
	</button>
	<div slot="hiddenContent">
		<AutoComplete {placeholderText} {data} />
	</div>
</HiddenSelectableInput>
