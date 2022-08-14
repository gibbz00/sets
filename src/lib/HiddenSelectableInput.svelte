<script lang="ts">
	import type { SvelteComponent, SvelteComponentTyped } from 'svelte'

	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'

	/* 
		Combines Hidden.svelte uses it with SelectableInput.svelte 
			* Autofocuses input when revealed
			* Hides selectable input when it dispatches selected or canceled events

		TODO:
			preserve height of input based on button height? 
				Believe it should be possible to get around with css
	*/
	export let placeholderText: string = ''
	export let listItems: SelectableInput['listItems'] = undefined
	export let listFilter: SelectableInput['listFilter'] = undefined
	export let dynamicWidth: boolean = true
	export let elementClasses: (SelectableInput extends SvelteComponentTyped<infer Prop>
		? Prop
		: never)['elementClasses'] = {}
	export let fadeTransition: boolean = false

	let hidden: boolean = true
</script>

<Hidden {fadeTransition} bind:hidden>
	<slot slot="placeholderContent" name="placeholderContent" />
	<SelectableInput
		autofocus
		{elementClasses}
		{dynamicWidth}
		slot="hiddenContent"
		on:selected={() => (hidden = true)}
		on:canceled={() => (hidden = true)}
		on:selected
		{placeholderText}
		{listItems}
		{listFilter}
	/>
</Hidden>
