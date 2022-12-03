<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte'

	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'

	/* 
		Combines Hidden.svelte uses it with SelectableInput.svelte 
			* Autofocuses input when revealed
			* Hides selectable input when it dispatches selected or canceled events
	*/
	export let placeholderText: string = ''
	export let dynamicWidth: boolean = true
	export let fadeTransition: boolean = false
	type SelectableInputProps = (SelectableInput extends SvelteComponentTyped<infer Prop> ? Prop : never)
	export let listItems: SelectableInputProps['listItems'] = undefined
	export let listOmit: SelectableInputProps['listOmit']  = undefined
	export let listFilter: SelectableInputProps['listFilter'] = undefined
	export let elementClasses: SelectableInputProps['elementClasses'] = {}

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
		on:selected
		{placeholderText}
		{listItems}
		{listOmit}
		{listFilter}
	/>
</Hidden>
